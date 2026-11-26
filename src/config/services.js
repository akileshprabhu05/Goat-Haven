/**
 * Service Layer Configuration & Constants
 * ────────────────────────────────────────
 * Centralizes database table/RPC names, localStorage keys,
 * default thresholds, and service-level error messages.
 */

export const DB_TABLES = {
  PRODUCTS: 'products',
  VARIANTS: 'product_variants',
  IMAGES: 'product_images',
  ADJUSTMENTS: 'inventory_adjustments',
  PROFILES: 'profiles',
};

export const DB_RPCS = {
  ADJUST_STOCK: 'adjust_stock',
};

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
};

export const IMAGE_UPLOAD = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB (matches Supabase bucket limit)
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
};

export const STORAGE_KEYS = {
  PRODUCTS: 'goat_haven_mock_db_v1',
  ADJUSTMENTS: 'goat_haven_adjustments_history_v1',
  LOCAL_ADMIN: 'goat_haven_local_admin',
};

export const SERVICE_DEFAULTS = {
  LOW_STOCK_THRESHOLD: 5,
  RECENT_PRODUCTS_LIMIT: 5,
  FALLBACK_ADMIN_EMAIL: 'admin@goathaven.com',
  FALLBACK_ADMIN_LABEL: 'Admin',
  UNKNOWN_PRODUCT_LABEL: 'Unknown Jersey',
  NO_SKU_LABEL: 'N/A',
  DEFAULT_SKU_PREFIX: 'SKU',
  LOCAL_ADMIN_ID: 'admin-local-uuid',
};

export const SERVICE_ERRORS = {
  PRODUCT_NOT_FOUND: 'Product not found',
  VARIANT_NOT_FOUND: (id) => `Variant not found with ID: ${id}`,
  INSUFFICIENT_STOCK: (prev, requested) =>
    `Insufficient stock. Current: ${prev}, requested reduction: ${requested}`,
  INVALID_CREDENTIALS:
    'Invalid credentials. Use admin@goathaven.com for local developer test.',
  AUTH_CONTEXT_MISSING: 'useAuth must be used within an AuthProvider',
  INVALID_IMAGE_TYPE: 'Unsupported image format. Please upload JPG, PNG, WebP, or SVG.',
  IMAGE_TOO_LARGE: 'Image size must be 5 MB or less.',
  IMAGE_UPLOAD_FAILED: 'Failed to upload image to storage.',
};
