-- ==============================================================================
-- GOAT HAVEN - SUPABASE DATABASE MIGRATION & RLS SCHEMA
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing triggers/functions if they exist
DROP FUNCTION IF EXISTS public.handle_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.adjust_stock CASCADE;
DROP FUNCTION IF EXISTS public.is_admin CASCADE;

-- 3. Utility Function: Automatically set updated_at on row update
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLE CREATION
-- ==============================================================================

-- 4.1 Profiles Table (maps auth.users to roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  team TEXT NOT NULL,
  season TEXT,
  jersey_type TEXT NOT NULL CHECK (jersey_type IN ('Home', 'Away', 'Third', 'Retro', 'Special')),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sku TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.3 Product Variants Table (Size & Stock)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  sku TEXT UNIQUE,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_product_variant_size UNIQUE (product_id, size)
);

-- 4.4 Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.5 Inventory Adjustments Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  previous_quantity INT NOT NULL,
  change_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  reason TEXT NOT NULL,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_team ON public.products(team);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_stock ON public.product_variants(stock_quantity);

CREATE INDEX IF NOT EXISTS idx_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_images_display_order ON public.product_images(product_id, display_order ASC);

CREATE INDEX IF NOT EXISTS idx_inventory_adj_variant_id ON public.inventory_adjustments(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_adj_created_at ON public.inventory_adjustments(created_at DESC);

-- ==============================================================================
-- 6. TRIGGERS
-- ==============================================================================
DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER trigger_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. ATOMIC TRANSACTION: SAFE STOCK ADJUSTMENT FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.adjust_stock(
  p_variant_id UUID,
  p_delta INT,
  p_reason TEXT,
  p_admin_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_current_stock INT;
  v_new_stock INT;
  v_admin_id UUID;
  v_result JSONB;
BEGIN
  -- Determine calling admin if not explicitly passed
  IF p_admin_id IS NULL THEN
    v_admin_id := auth.uid();
  ELSE
    v_admin_id := p_admin_id;
  END IF;

  -- Lock the target variant row for update to prevent concurrent race conditions
  SELECT stock_quantity INTO v_current_stock
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found with ID: %', p_variant_id;
  END IF;

  -- Compute new stock
  v_new_stock := v_current_stock + p_delta;

  IF v_new_stock < 0 THEN
    RAISE EXCEPTION 'Insufficient stock. Current: %, requested reduction: %', v_current_stock, ABS(p_delta);
  END IF;

  -- Update variant stock
  UPDATE public.product_variants
  SET stock_quantity = v_new_stock,
      updated_at = now()
  WHERE id = p_variant_id;

  -- Record audit log in inventory_adjustments
  INSERT INTO public.inventory_adjustments (
    variant_id,
    previous_quantity,
    change_quantity,
    new_quantity,
    reason,
    admin_id
  ) VALUES (
    p_variant_id,
    v_current_stock,
    p_delta,
    v_new_stock,
    p_reason,
    v_admin_id
  );

  v_result := jsonb_build_object(
    'success', true,
    'variant_id', p_variant_id,
    'previous_quantity', v_current_stock,
    'change_quantity', p_delta,
    'new_quantity', v_new_stock
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function: Check if current auth user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_adjustments ENABLE ROW LEVEL SECURITY;

-- 8.1 PROFILES POLICIES
-- Admins can read their own profile
CREATE POLICY "Admins can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 8.2 PRODUCTS POLICIES
-- Public can read active products
CREATE POLICY "Public can view active products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

-- Only admins can insert, update, or delete products
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 8.3 PRODUCT VARIANTS POLICIES
-- Public can view variants belonging to active products
CREATE POLICY "Public can view variants of active products"
  ON public.product_variants
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND (p.is_active = true OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage variants"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8.4 PRODUCT IMAGES POLICIES
-- Public can view images of active products
CREATE POLICY "Public can view images of active products"
  ON public.product_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
        AND (p.is_active = true OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8.5 INVENTORY ADJUSTMENTS POLICIES
-- Strictly admin-only read and insert
CREATE POLICY "Admins can view inventory adjustments"
  ON public.inventory_adjustments
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert inventory adjustments"
  ON public.inventory_adjustments
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION (product-images)
-- ==============================================================================
-- Insert the bucket into storage.buckets if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- Storage RLS: Public read access
CREATE POLICY "Public can read product images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Storage RLS: Admin upload access
CREATE POLICY "Admins can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Storage RLS: Admin update access
CREATE POLICY "Admins can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Storage RLS: Admin delete access
CREATE POLICY "Admins can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );
