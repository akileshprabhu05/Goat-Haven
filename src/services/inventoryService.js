import { supabase, isSupabaseConfigured } from './supabase';
import { productService } from './productService';
import { readLocalCollection, writeLocalCollection } from './localStore';
import { INITIAL_LOCAL_ADJUSTMENTS } from '../data/seedProducts';
import {
  DB_TABLES,
  DB_RPCS,
  STORAGE_KEYS,
  SERVICE_DEFAULTS,
  SERVICE_ERRORS,
} from '../config/services';

function appendLocalAdjustment(entry) {
  const history = readLocalCollection(STORAGE_KEYS.ADJUSTMENTS, INITIAL_LOCAL_ADJUSTMENTS);
  history.unshift(entry);
  writeLocalCollection(STORAGE_KEYS.ADJUSTMENTS, history);
}

export const inventoryService = {
  /**
   * Computes comprehensive inventory KPI statistics for the Admin Dashboard
   */
  async getInventoryOverview(lowStockThreshold = SERVICE_DEFAULTS.LOW_STOCK_THRESHOLD) {
    const products = await productService.getProducts({ adminMode: true });

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.is_active).length;
    let totalStockUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const allVariants = [];

    products.forEach((p) => {
      (p.variants || []).forEach((v) => {
        const qty = v.stock_quantity || 0;
        totalStockUnits += qty;

        allVariants.push({
          ...v,
          product_id: p.id,
          product_name: p.name,
          product_team: p.team,
          product_price: p.price,
          product_is_active: p.is_active,
          product_image: p.images?.[0]?.image_url || null,
        });

        if (qty === 0) {
          outOfStockCount++;
        } else if (qty <= lowStockThreshold) {
          lowStockCount++;
        }
      });
    });

    return {
      totalProducts,
      activeProducts,
      totalStockUnits,
      lowStockCount,
      outOfStockCount,
      allVariants,
      recentlyUpdated: products.slice(0, SERVICE_DEFAULTS.RECENT_PRODUCTS_LIMIT),
    };
  },

  /**
   * Adjusts stock quantity safely with reason logging.
   * Uses PostgreSQL atomic RPC `adjust_stock` when Supabase is active.
   */
  async adjustStock({
    variantId,
    delta,
    reason,
    adminId = null,
    adminEmail = SERVICE_DEFAULTS.FALLBACK_ADMIN_EMAIL,
  }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc(DB_RPCS.ADJUST_STOCK, {
          p_variant_id: variantId,
          p_delta: parseInt(delta, 10),
          p_reason: reason,
          p_admin_id: adminId,
        });

        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase adjust_stock RPC failed:', err.message);
      }
    }

    // Local in-memory / storage fallback
    const products = await productService.getProducts({ adminMode: true });
    let targetVariant = null;
    let targetProduct = null;

    for (const p of products) {
      const v = (p.variants || []).find((x) => x.id === variantId);
      if (v) {
        targetVariant = v;
        targetProduct = p;
        break;
      }
    }

    if (!targetVariant) {
      throw new Error(SERVICE_ERRORS.VARIANT_NOT_FOUND(variantId));
    }

    const prevQty = targetVariant.stock_quantity || 0;
    const change = parseInt(delta, 10);
    const newQty = prevQty + change;

    if (newQty < 0) {
      throw new Error(SERVICE_ERRORS.INSUFFICIENT_STOCK(prevQty, Math.abs(change)));
    }

    targetVariant.stock_quantity = newQty;
    await productService.updateProduct(targetProduct.id, {
      product: targetProduct,
      variants: targetProduct.variants,
    });

    appendLocalAdjustment({
      id: `adj-${Date.now()}`,
      variant_id: variantId,
      product_name: targetProduct.name,
      size: targetVariant.size,
      previous_quantity: prevQty,
      change_quantity: change,
      new_quantity: newQty,
      reason,
      created_at: new Date().toISOString(),
      admin_email: adminEmail,
    });

    return {
      success: true,
      variant_id: variantId,
      previous_quantity: prevQty,
      change_quantity: change,
      new_quantity: newQty,
    };
  },

  /**
   * Fetch adjustment history audit logs
   */
  async getAdjustmentHistory() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(DB_TABLES.ADJUSTMENTS)
          .select(`
            *,
            variant:${DB_TABLES.VARIANTS}(size, product:${DB_TABLES.PRODUCTS}(name))
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map((d) => ({
          ...d,
          product_name: d.variant?.product?.name || SERVICE_DEFAULTS.UNKNOWN_PRODUCT_LABEL,
          size: d.variant?.size || SERVICE_DEFAULTS.NO_SKU_LABEL,
          admin_email: SERVICE_DEFAULTS.FALLBACK_ADMIN_LABEL,
        }));
      } catch (err) {
        console.warn('Supabase adjustment history fetch failed:', err.message);
      }
    }

    return readLocalCollection(STORAGE_KEYS.ADJUSTMENTS, INITIAL_LOCAL_ADJUSTMENTS);
  },
};
