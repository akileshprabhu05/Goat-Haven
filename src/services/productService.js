import { supabase, isSupabaseConfigured } from './supabase';
import { slugify } from '../utils/slugify';
import { readLocalCollection, writeLocalCollection } from './localStore';
import { INITIAL_LOCAL_PRODUCTS } from '../data/seedProducts';
import {
  DB_TABLES,
  STORAGE_BUCKETS,
  IMAGE_UPLOAD,
  STORAGE_KEYS,
  SERVICE_DEFAULTS,
  SERVICE_ERRORS,
} from '../config/services';

/**
 * Resize/compress raster images for local-storage fallback mode so
 * uploading images without Supabase configured doesn't exceed quota.
 */
function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(SERVICE_ERRORS.IMAGE_UPLOAD_FAILED));
    reader.onload = () => {
      const result = reader.result;
      if (file.type === 'image/svg+xml' || typeof result !== 'string') {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        const maxDim = 1200;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        if (scale === 1 && file.size <= 350 * 1024) {
          resolve(result);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(outType, 0.85));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Shared search, stock, and sorting pipeline used by both
 * Supabase and localStorage product queries.
 */
function applyProductFiltersAndSort(items, { search = '', inStockOnly = false, sortBy = 'newest' }) {
  let result = [...items];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  if (inStockOnly) {
    result = result.filter((p) => p.variants?.some((v) => v.stock_quantity > 0));
  }

  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return result;
}

/**
 * Product Service for Goat Haven
 */
export const productService = {
  /**
   * Fetch products for the customer catalogue or admin table with filters
   */
  async getProducts({
    search = '',
    team = 'all',
    jerseyType = 'all',
    sortBy = 'newest',
    inStockOnly = false,
    adminMode = false,
  } = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from(DB_TABLES.PRODUCTS)
          .select(`
            *,
            images:${DB_TABLES.IMAGES}(*),
            variants:${DB_TABLES.VARIANTS}(*)
          `)
          .order('created_at', { ascending: false });

        if (!adminMode) {
          query = query.eq('is_active', true);
        }
        if (team && team !== 'all') {
          query = query.eq('team', team);
        }
        if (jerseyType && jerseyType !== 'all') {
          query = query.eq('jersey_type', jerseyType);
        }

        const { data, error } = await query;
        if (error) throw error;

        return applyProductFiltersAndSort(data || [], { search, inStockOnly, sortBy });
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to cached catalog:', err.message);
      }
    }

    // Local / Offline Store Fallback
    let items = readLocalCollection(STORAGE_KEYS.PRODUCTS, INITIAL_LOCAL_PRODUCTS);

    if (!adminMode) {
      items = items.filter((p) => p.is_active);
    }
    if (team && team !== 'all') {
      items = items.filter((p) => p.team.toLowerCase() === team.toLowerCase());
    }
    if (jerseyType && jerseyType !== 'all') {
      items = items.filter((p) => p.jersey_type.toLowerCase() === jerseyType.toLowerCase());
    }

    return applyProductFiltersAndSort(items, { search, inStockOnly, sortBy });
  },

  /**
   * Get single product by URL slug
   */
  async getProductBySlug(slug) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(DB_TABLES.PRODUCTS)
          .select(`
            *,
            images:${DB_TABLES.IMAGES}(*),
            variants:${DB_TABLES.VARIANTS}(*)
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase fetch by slug failed:', err.message);
      }
    }

    const items = readLocalCollection(STORAGE_KEYS.PRODUCTS, INITIAL_LOCAL_PRODUCTS);
    return items.find((p) => p.slug === slug) || null;
  },

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts() {
    const products = await this.getProducts({ adminMode: false });
    return products.filter((p) => p.is_featured);
  },

  /**
   * Get distinct list of teams for filter buttons
   */
  async getTeams() {
    const products = await this.getProducts({ adminMode: true });
    const teams = Array.from(new Set(products.map((p) => p.team))).filter(Boolean);
    return teams.sort();
  },

  /**
   * Admin: Upload a product image to Supabase Storage (`product-images` bucket)
   * and return its public URL. Falls back to a compressed data URL in local mode.
   */
  async uploadProductImage(file, productKey = 'jersey') {
    if (!file) throw new Error(SERVICE_ERRORS.IMAGE_UPLOAD_FAILED);

    if (!IMAGE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(SERVICE_ERRORS.INVALID_IMAGE_TYPE);
    }
    if (file.size > IMAGE_UPLOAD.MAX_SIZE_BYTES) {
      throw new Error(SERVICE_ERRORS.IMAGE_TOO_LARGE);
    }

    if (isSupabaseConfigured && supabase) {
      const folder = slugify(productKey) || 'jersey';
      const rawExt = file.name?.split('.').pop()?.toLowerCase() || '';
      const fallbackExt = file.type.split('/')[1]?.replace('svg+xml', 'svg') || 'jpg';
      const ext = /^[a-z0-9]+$/.test(rawExt) ? rawExt : fallbackExt;
      const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const filePath = `jerseys/${folder}/${uniqueId}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        throw new Error(error.message || SERVICE_ERRORS.IMAGE_UPLOAD_FAILED);
      }

      const { data: publicData } = supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
        .getPublicUrl(data.path);

      if (!publicData?.publicUrl) {
        throw new Error(SERVICE_ERRORS.IMAGE_UPLOAD_FAILED);
      }

      return publicData.publicUrl;
    }

    return readImageAsDataUrl(file);
  },

  /**
   * Admin: Create new product with variants and images
   */
  async createProduct({ product, variants = [], images = [] }) {
    const slug = product.slug || slugify(product.name);
    const skuPrefix = product.sku || SERVICE_DEFAULTS.DEFAULT_SKU_PREFIX;

    if (isSupabaseConfigured && supabase) {
      const { data: newProd, error: prodErr } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .insert([
          {
            name: product.name,
            slug,
            description: product.description,
            team: product.team,
            season: product.season,
            jersey_type: product.jersey_type,
            price: parseFloat(product.price),
            sku: product.sku || null,
            is_active: product.is_active ?? true,
            is_featured: product.is_featured ?? false,
          },
        ])
        .select()
        .single();

      if (prodErr) throw prodErr;

      if (variants.length > 0) {
        const variantPayload = variants.map((v) => ({
          product_id: newProd.id,
          size: v.size,
          sku: v.sku || `${newProd.sku || SERVICE_DEFAULTS.DEFAULT_SKU_PREFIX}-${v.size}`,
          stock_quantity: parseInt(v.stock_quantity, 10) || 0,
        }));
        const { error: varErr } = await supabase.from(DB_TABLES.VARIANTS).insert(variantPayload);
        if (varErr) throw varErr;
      }

      if (images.length > 0) {
        const imagePayload = images.map((img, idx) => ({
          product_id: newProd.id,
          image_url: img.image_url || img,
          display_order: idx,
        }));
        const { error: imgErr } = await supabase.from(DB_TABLES.IMAGES).insert(imagePayload);
        if (imgErr) throw imgErr;
      }

      return newProd;
    }

    // Local Store Creation
    const items = readLocalCollection(STORAGE_KEYS.PRODUCTS, INITIAL_LOCAL_PRODUCTS);
    const id = `local-prod-${Date.now()}`;
    const now = new Date().toISOString();

    const newProduct = {
      ...product,
      id,
      slug,
      price: parseFloat(product.price),
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      created_at: now,
      updated_at: now,
      variants: variants.map((v, idx) => ({
        id: `var-${id}-${idx}`,
        size: v.size,
        sku: v.sku || `${skuPrefix}-${v.size}`,
        stock_quantity: parseInt(v.stock_quantity, 10) || 0,
      })),
      images: images.map((img, idx) => ({
        id: `img-${id}-${idx}`,
        image_url: img.image_url || img,
        display_order: idx,
      })),
    };

    items.unshift(newProduct);
    writeLocalCollection(STORAGE_KEYS.PRODUCTS, items);
    return newProduct;
  },

  /**
   * Admin: Update product details, variants, images
   */
  async updateProduct(id, { product, variants = [], images = [] }) {
    if (isSupabaseConfigured && supabase) {
      const { data: updatedProd, error: prodErr } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .update({
          name: product.name,
          slug: product.slug || slugify(product.name),
          description: product.description,
          team: product.team,
          season: product.season,
          jersey_type: product.jersey_type,
          price: parseFloat(product.price),
          sku: product.sku,
          is_active: product.is_active,
          is_featured: product.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (prodErr) throw prodErr;

      if (variants.length > 0) {
        for (const v of variants) {
          if (v.id) {
            await supabase
              .from(DB_TABLES.VARIANTS)
              .update({
                size: v.size,
                sku: v.sku,
                stock_quantity: parseInt(v.stock_quantity, 10) || 0,
              })
              .eq('id', v.id);
          } else {
            await supabase.from(DB_TABLES.VARIANTS).insert({
              product_id: id,
              size: v.size,
              sku: v.sku || `${product.sku}-${v.size}`,
              stock_quantity: parseInt(v.stock_quantity, 10) || 0,
            });
          }
        }
      }

      const { error: delImgErr } = await supabase.from(DB_TABLES.IMAGES).delete().eq('product_id', id);
      if (delImgErr) throw delImgErr;

      if (images.length > 0) {
        const imagePayload = images.map((img, idx) => ({
          product_id: id,
          image_url: img.image_url || img,
          display_order: idx,
        }));
        const { error: insImgErr } = await supabase.from(DB_TABLES.IMAGES).insert(imagePayload);
        if (insImgErr) throw insImgErr;
      }

      return updatedProd;
    }

    // Local Update
    const items = readLocalCollection(STORAGE_KEYS.PRODUCTS, INITIAL_LOCAL_PRODUCTS);
    const index = items.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(SERVICE_ERRORS.PRODUCT_NOT_FOUND);

    items[index] = {
      ...items[index],
      ...product,
      price: parseFloat(product.price),
      updated_at: new Date().toISOString(),
      variants: variants.length > 0 ? variants : items[index].variants,
      images: images.map((img, idx) => ({
        id: img.id || `img-${id}-${idx}`,
        image_url: img.image_url || img,
        display_order: idx,
      })),
    };

    writeLocalCollection(STORAGE_KEYS.PRODUCTS, items);
    return items[index];
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from(DB_TABLES.PRODUCTS).delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const items = readLocalCollection(STORAGE_KEYS.PRODUCTS, INITIAL_LOCAL_PRODUCTS);
    writeLocalCollection(
      STORAGE_KEYS.PRODUCTS,
      items.filter((p) => p.id !== id)
    );
    return true;
  },

  /**
   * Admin: Toggle featured status
   */
  async toggleFeatured(id, currentStatus) {
    return this._toggleBooleanField(id, 'is_featured', currentStatus);
  },

  /**
   * Admin: Toggle active visibility status
   */
  async toggleActive(id, currentStatus) {
    return this._toggleBooleanField(id, 'is_active', currentStatus);
  },

  /**
   * Shared helper for boolean flag toggles on products
   */
  async _toggleBooleanField(id, field, currentStatus) {
    const nextValue = !currentStatus;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .update({ [field]: nextValue })
        .eq('id', id);
      if (error) throw error;
      return nextValue;
    }

    const items = readLocalCollection(STORAGE_KEYS.PRODUCTS, INITIAL_LOCAL_PRODUCTS);
    const item = items.find((p) => p.id === id);
    if (item) {
      item[field] = nextValue;
      writeLocalCollection(STORAGE_KEYS.PRODUCTS, items);
      return item[field];
    }
    return false;
  },
};
