/**
 * GOAT HAVEN — Central UI Content Configuration
 * ─────────────────────────────────────────────
 * ALL static text, labels, links, lists, defaults, and copy used across
 * pages and components live here. No literal strings should appear inside
 * JSX component files. Import what you need from this file.
 *
 * Sections
 *  1. Navigation
 *  2. Home Page
 *  3. Products / Catalogue Page
 *  4. Product Detail Page
 *  5. Footer
 *  6. Admin Sidebar & Dashboard
 *  7. Product Form Defaults
 *  8. WhatsApp Messages
 *  9. SEO Meta
 * 10. Global UI Labels (errors, empty states, etc.)
 */

// ─── 1. NAVIGATION ───────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { name: 'Home',           path: '/' },
  { name: 'Kits Catalogue', path: '/products' },
  { name: 'Retro Grails',   path: '/products?type=Retro' },
];

export const LOGO_SUBTITLE = 'Football Jerseys';
export const WHATSAPP_NAV_LABEL = 'WhatsApp Direct';
export const WHATSAPP_NAV_LABEL_MOBILE = 'Chat on WhatsApp';

// ─── 2. HOME PAGE ────────────────────────────────────────────────────────────

export const ANNOUNCEMENT_BAR = [
  '2024/25 matchday kits are live',
  'Dispatched within 24 hours across India',
  'Order on WhatsApp with live stock check',
  'Player and stadium grade kits',
];

export const HOME = {
  // Hero (interactive carousel slides)
  heroSlides: [
    {
      id: 'matchday-2425',
      eyebrow: '2024/25 Matchday Drop',
      headline: 'WEAR THE',
      headlineAccent: 'LEGACY.',
      accentGradient: 'from-white via-rose-200 to-brand-accent',
      subtitle: 'Player edition textiles & live S–XXL stock validation.',
      ctaLabel: 'Shop Matchday Kits',
      ctaPath: '/products',
      imageUrl:
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'retro-grails',
      eyebrow: 'Collector Vault',
      headline: 'ICONIC',
      headlineAccent: 'RETROS.',
      accentGradient: 'from-white via-rose-200 to-brand-accent',
      subtitle: '90s & 2000s championship classics. Limited collector stock.',
      ctaLabel: 'Explore Retro Grails',
      ctaPath: '/products?type=Retro',
      imageUrl:
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'special-editions',
      eyebrow: 'Limited Release',
      headline: 'SPECIAL',
      headlineAccent: 'EDITIONS.',
      accentGradient: 'from-white via-rose-200 to-brand-accent',
      subtitle: 'Limited club collaborations & third kits for true jersey collectors.',
      ctaLabel: 'View Special Drops',
      ctaPath: '/products?type=Special',
      imageUrl:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
    },
  ],

  hero: {
    eyebrow: '2024/25 Matchday Kits & Retro Grails',
    headline: 'WEAR THE',
    headlineAccent: 'LEGACY.',
    subtitle:
      'Curated football jerseys for connoisseurs. Player edition textiles, verified retro shirts, and frictionless WhatsApp checkout with real-time size validation.',
    ctaPrimary: 'Explore Catalogue',
    ctaWhatsApp: 'WhatsApp',
    trustBadges: [
      'Real Stock Allocation',
      'S to XXL Sizes',
      'Express Dispatch',
    ],
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=2000&q=80',
  },

  // Club / team horizontal strip
  clubStrip: {
    label: 'Shop by club',
    allClubsLabel: 'All Clubs',
  },

  // Visual Kit Category Tiles (Souled-Store style category blocks)
  kitCategories: {
    eyebrow: 'Curated Collections',
    heading: 'Shop By Kit',
    items: [
      {
        type: 'Home',
        title: 'Home Kits',
        subtitle: '24/25 Stadium Icons',
        imageUrl:
          'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
        path: '/products?type=Home',
      },
      {
        type: 'Away',
        title: 'Away Kits',
        subtitle: 'Midnight & Bold Cuts',
        imageUrl:
          'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
        path: '/products?type=Away',
      },
      {
        type: 'Retro',
        title: 'Retro Grails',
        subtitle: '90s & 00s Legends',
        imageUrl:
          'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
        path: '/products?type=Retro',
      },
      {
        type: 'Special',
        title: 'Special Drops',
        subtitle: 'Collab & Third Kits',
        imageUrl:
          'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
        path: '/products?type=Special',
      },
    ],
  },

  // Featured jerseys section
  featured: {
    eyebrow: "Curator's Highlights",
    heading: 'Featured Drops',
    viewAllLabel: 'View All',
    maxItems: 6,
  },

  // Interactive tabbed collection section
  trendingTabs: {
    eyebrow: 'Fresh From Stadium Vaults',
    heading: 'Trending Jerseys',
    viewAllLabel: 'Full Vault',
    maxItems: 6,
    tabs: [
      { value: 'all', label: 'All Kits' },
      { value: 'Home', label: 'Home' },
      { value: 'Away', label: 'Away' },
      { value: 'Retro', label: 'Retro' },
      { value: 'Special', label: 'Special' },
    ],
    emptyTabLabel: 'No jerseys in this category yet.',
  },

  // New arrivals section (kept for compatibility)
  newArrivals: {
    eyebrow: 'Fresh From Stadium Vaults',
    heading: 'New Arrivals',
    viewAllLabel: 'See Complete Vault',
    maxItems: 8,
  },

  // "Why choose us" section
  whyUs: {
    eyebrow: 'The Standard',
    heading: 'Engineered For Passion',
    body: 'Every kit in our inventory undergoes strict inspection for embroidery precision, fabric breathability, and badge authenticity.',
  },

  // Bottom WhatsApp CTA banner
  whatsappBanner: {
    eyebrow: 'Direct Concierge',
    heading: 'Looking for a rare retro kit or custom print?',
    body: "Message our jersey curators directly on WhatsApp. Send us reference images or player names, and we'll check our private collectors network for you.",
    ctaLabel: 'Chat with Curator on WhatsApp',
  },
};

// ─── 3. PRODUCTS / CATALOGUE PAGE ────────────────────────────────────────────

export const CATALOGUE = {
  pageTitle: 'Jersey Vault',
  pageSubtitle:
    'Explore authentic player and fan edition football jerseys with real-time stock allocation.',

  // All valid jersey type filter chips (drives both filter chips & <select> options)
  jerseyTypes: [
    { value: 'all',     label: 'All' },
    { value: 'Home',    label: 'Home' },
    { value: 'Away',    label: 'Away' },
    { value: 'Third',   label: 'Third' },
    { value: 'Retro',   label: 'Retro' },
    { value: 'Special', label: 'Special' },
  ],

  sortOptions: [
    { value: 'newest',     label: 'Sort: Newest First' },
    { value: 'price-asc',  label: 'Sort: Price Low to High' },
    { value: 'price-desc', label: 'Sort: Price High to Low' },
  ],

  filters: {
    teamPlaceholder: 'All Clubs & Nations',
    typePlaceholder: 'All Jersey Types',
    searchPlaceholder: 'Search jerseys or clubs',
    inStockLabel: 'In Stock Only',
    resetLabel: 'Reset Filters',
    typeLabel: 'Type:',
    filtersButton: 'Filters',
    applyFiltersLabel: 'Show Results',
    viewDensityLabel: 'Grid:',
  },

  results: {
    singularUnit: 'jersey',
    pluralUnit: 'jerseys',
    showing: 'Showing',
  },

  empty: {
    heading: 'No Jerseys Matched Your Filter',
    body: 'Try resetting your search query or team filter to see the complete collection.',
    resetLabel: 'Reset All Filters',
  },
};

// ─── 4. PRODUCT DETAIL PAGE ──────────────────────────────────────────────────

export const PRODUCT_DETAIL = {
  backLabel: 'Back to Vault',
  skuPrefix: 'SKU:',
  priceDisclaimer: 'Inclusive of all taxes. Free WhatsApp stock check.',
  descriptionSectionLabel: 'Kit Overview & Fabric Specs',
  relatedSectionPrefix: 'More From',
  quantityLabel: 'Quantity',
  maxLabel: 'Max:',
  subtotalPrefix: 'Order Subtotal',
  whatsappNote:
    'Clicking will open WhatsApp with your chosen jersey, size, and quantity prefilled. Stock is reserved only upon seller confirmation.',

  // Trust / guarantee strip (icon name from lucide-react + label)
  guarantees: [
    { icon: 'ShieldCheck', label: 'Player & Stadium Grade',  color: 'text-emerald-400' },
    { icon: 'Truck',       label: '24hr Express Dispatch',    color: 'text-yellow-400' },
  ],

  // Error / not-found state
  notFound: {
    heading: 'Jersey Not Found',
    body: 'The kit you requested might have been removed or renamed.',
    ctaLabel: 'Back to Catalogue',
  },

  stock: {
    outOfStockLabel: 'Currently Out of Stock in',
    availableLabel: 'units available in',
  },
};

// ─── 5. FOOTER ───────────────────────────────────────────────────────────────

export const FOOTER = {
  logoInitials: 'GH',
  taglineSuffix: 'Designed for true football enthusiasts and jersey collectors worldwide.',
  builtByLine: 'Built for authentic football jersey collectors.',

  // Three feature strip items shown at the top of the footer
  featureStrip: [
    {
      icon: 'ShieldCheck',
      iconColor: 'text-brand-accent',
      title: 'Premium Grade',
      body: 'Authentic stitching, player and fan edition jerseys.',
    },
    {
      icon: 'MessageCircle',
      iconColor: 'text-[#25D366]',
      title: 'WhatsApp Direct',
      body: 'Order straight with our curator. Instant stock checks.',
    },
    {
      icon: 'Truck',
      iconColor: 'text-yellow-500',
      title: 'Tracked Courier',
      body: 'Prompt packaging with real-time tracking IDs provided.',
    },
  ],

  // Footer quick navigation links
  exploreLinks: [
    { label: 'All Football Jerseys',   path: '/products' },
    { label: 'Home Kits 2024/25',      path: '/products?type=Home' },
    { label: 'Away & Third Kits',      path: '/products?type=Away' },
    { label: 'Retro & Vintage Classics', path: '/products?type=Retro' },
  ],

  // Popular club links — driven from config so they can be updated without touching components
  popularClubs: [
    { label: 'Real Madrid',     path: '/products?team=Real Madrid' },
    { label: 'Arsenal',         path: '/products?team=Arsenal' },
    { label: 'Manchester City', path: '/products?team=Manchester City' },
    { label: 'FC Barcelona',    path: '/products?team=FC Barcelona' },
  ],

  columns: {
    exploreHeading: 'Explore',
    clubsHeading: 'Popular Clubs',
  },
};

// ─── 6. ADMIN SIDEBAR & DASHBOARD ────────────────────────────────────────────

export const ADMIN_NAV = [
  { label: 'Overview',  path: '/admin',           icon: 'LayoutDashboard' },
  { label: 'Products',  path: '/admin/products',  icon: 'Shirt' },
  { label: 'Inventory', path: '/admin/inventory', icon: 'Boxes' },
];

export const ADMIN_SIDEBAR = {
  consoleBadge: 'Admin Console',
  viewStoreLabel: 'View Public Store',
  loggedInAs: 'Logged in as',
  signOutLabel: 'Sign Out',
  fallbackEmail: 'admin@goathaven.com',
};

export const ADMIN_DASHBOARD = {
  pageTitle: 'Dashboard Overview',
  pageSubtitle: 'Real-time catalogue inventory metrics and stock alert center.',
  addJerseyLabel: 'Add Jersey',
  refreshTitle: 'Refresh statistics',

  // Low-stock threshold (variants at or below this quantity trigger a warning)
  lowStockThreshold: 5,

  kpiCards: [
    { key: 'totalProducts',  label: 'Total Products',   valueKey: 'totalProducts',  subKey: 'activeProducts', subSuffix: 'active', icon: 'Shirt' },
    { key: 'totalStock',     label: 'Stock In Vault',   valueKey: 'totalStockUnits', subSuffix: 'total units', icon: 'Boxes' },
    { key: 'lowStock',       label: 'Low Stock Alert',  valueKey: 'lowStockCount',  subSuffix: 'variants ≤ 5 units', icon: 'AlertTriangle' },
    { key: 'outOfStock',     label: 'Out of Stock',     valueKey: 'outOfStockCount', subSuffix: 'depleted sizes', icon: 'XCircle' },
  ],

  restockSection: {
    heading: 'Inventory Requiring Restock',
    subtitle: 'Size variants that are depleted or running below safe threshold.',
    viewAllLabel: 'Full Inventory Matrix',
    allStockedMessage: '✓ All jersey size variants are adequately stocked above threshold!',
  },

  recentSection: {
    heading: 'Recently Managed Jerseys',
    subtitle: 'Products in catalogue.',
    viewAllLabel: 'View All Products',
  },
};

export const ADMIN_PRODUCTS = {
  pageTitle: 'Product Management',
  pageSubtitle: 'Manage football jerseys, upload high-res imagery, and set club pricing.',
  addLabel: 'Add Jersey',
  refreshTitle: 'Refresh catalogue',
  searchPlaceholder: 'Search products by title, team, SKU...',
  noResultsText: 'No jerseys found matching your criteria.',
  columns: {
    item: 'Item',
    club: 'Club / Team',
    type: 'Type',
    price: 'Price',
    sizes: 'Sizes & Stock',
    status: 'Status',
    featured: 'Featured',
    actions: 'Actions',
  },
  status: {
    active: 'Active',
    hidden: 'Hidden',
  },
  totalUnitsLabel: 'Total:',
  totalUnitsSuffix: 'units',
};

export const ADMIN_INVENTORY = {
  pageTitle: 'Inventory Management',
  pageSubtitle: 'Size-by-size stock allocation and audit adjustment history.',
  refreshTitle: 'Refresh stock levels',
  tabs: {
    matrix: 'Size Stock Matrix',
    history: 'Adjustment History',
  },
  matrix: {
    searchPlaceholder: 'Search variant by jersey or SKU...',
    showingLabel: 'Showing',
    showingUnitsSuffix: 'size variants',
    columns: {
      product: 'Jersey Product',
      size: 'Size',
      sku: 'Variant SKU',
      stock: 'Stock Quantity',
      status: 'Status',
      action: 'Quick Stock Action',
    },
    noSkuLabel: 'N/A',
    adjustLabel: 'Adjust Stock',
  },
  history: {
    heading: 'Inventory Audit Log',
    subtitle: 'Every stock update from supplier arrivals or WhatsApp sales is permanently recorded.',
    noHistoryText: 'No inventory adjustments logged yet.',
    columns: {
      date: 'Date & Time',
      product: 'Product & Size',
      prev: 'Previous Qty',
      change: 'Change',
      new: 'New Qty',
      reason: 'Reason / Notes',
      admin: 'Admin',
    },
    fallbackAdmin: 'Owner',
  },
  statusLabels: {
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
  },
};

// ─── 7. PRODUCT FORM DEFAULTS ────────────────────────────────────────────────

export const PRODUCT_FORM = {
  // Modal titles
  addTitle: 'Add New Football Jersey',
  editTitle: 'Edit Jersey Specs',

  // All jersey types as options
  jerseyTypeOptions: [
    { value: 'Home',    label: 'Home Kit' },
    { value: 'Away',    label: 'Away Kit' },
    { value: 'Third',   label: 'Third Kit' },
    { value: 'Retro',   label: 'Retro Classic' },
    { value: 'Special', label: 'Special Edition' },
  ],

  // Default season shown when creating a new product
  defaultSeason: '2024/25',

  // Default size/stock presets pre-populated on new product creation
  defaultVariants: [
    { size: 'S',  stock_quantity: 5 },
    { size: 'M',  stock_quantity: 10 },
    { size: 'L',  stock_quantity: 8 },
    { size: 'XL', stock_quantity: 4 },
  ],

  // Default new variant added when clicking "+ Add Size"
  newVariantDefault: { size: 'XXL', stock_quantity: 5 },

  // Field labels
  labels: {
    name: 'Jersey Name',
    slug: 'Slug (URL Identifier)',
    team: 'Club / National Team',
    season: 'Season',
    jerseyType: 'Jersey Type',
    price: 'Price (INR)',
    description: 'Fabric & Design Description',
    sizesHeading: 'Sizes & Initial Stock Allocation',
    imagesHeading: 'Product Images',
    addSizeLabel: '+ Add Size',
    addImageLabel: '+ Paste Image URL',
    uploadDropTitle: 'Click to upload or drag & drop jersey photos',
    uploadDropSubtitle: 'PNG, JPG, WebP or SVG up to 5 MB each · Stored in Supabase',
    uploadingLabel: 'Uploading to Supabase...',
    primaryImageBadge: 'Primary',
    setPrimaryLabel: 'Make primary',
    stockUnitsLabel: 'Stock Units:',
    isActiveLabel: 'Active in Customer Store',
    isFeaturedLabel: 'Feature on Homepage',
    basicInfoHeading: 'Basic Information',
  },

  // Placeholders
  placeholders: {
    name: 'e.g. Real Madrid 2024/25 Home Kit',
    team: 'e.g. Real Madrid',
    season: '2024/25 or 1998',
    price: '2499',
    description: 'High-performance moisture-wicking AEROREADY fabric, gold sponsor prints...',
    imageUrl: 'https://images.unsplash.com/... or Supabase storage public URL',
    sizeInput: 'Size (e.g. M)',
  },

  // Validation messages
  validation: {
    requiredFields: 'Name, Club/Team, and Price are mandatory.',
    operationFailed: 'Operation failed',
  },

  // Success toasts
  toasts: {
    created: 'New jersey added to catalogue',
    updated: 'Jersey updated successfully',
  },

  // Button labels
  buttons: {
    cancel: 'Cancel',
    publish: 'Publish Jersey',
    save: 'Save Changes',
  },
};

// ─── 8. WHATSAPP MESSAGES ────────────────────────────────────────────────────

export const WHATSAPP_CONTENT = {
  // Inquiry message sent when user clicks WhatsApp from navbar/footer
  generalInquiry: "Hi Goat Haven! I'm searching for a rare football jersey. Can you help me find it?",
  fallbackInquiry: (brandName) =>
    `Hi ${brandName}! I have an inquiry regarding your football jersey collection.`,
  missingSelectionError:
    'Product and size variant must be selected to generate WhatsApp order.',
  orderTemplate: {
    header: (brandName) => `🔥 *NEW JERSEY ORDER INQUIRY - ${brandName}*`,
    divider: '----------------------------------------',
    productLabel: '🏷️ *Product:*',
    skuLabel: '🆔 *SKU:*',
    sizeLabel: '👕 *Size:*',
    quantityLabel: '📦 *Quantity:*',
    unitPriceLabel: '💰 *Unit Price:*',
    totalPriceLabel: '💳 *Estimated Total:*',
    closingLine1:
      "Hi! I'd like to place an order for this jersey. Could you please confirm stock availability and share payment/delivery details?",
    closingLine2: 'Thank you!',
  },
};

// ─── 9. SEO META ─────────────────────────────────────────────────────────────

export const SEO = {
  home: {
    title: 'Home',
    description:
      'Premium authentic football jerseys, 2024/25 matchday kits, and legendary retro grails. Direct WhatsApp ordering.',
  },
  catalogue: {
    title: 'Jersey Catalogue',
    description:
      'Browse authentic football kits, retro grails, and limited edition club jerseys. Filter by team, type, and live size availability.',
  },
  adminLogin: {
    title: 'Admin Login',
  },
};

// ─── 10. GLOBAL UI LABELS ────────────────────────────────────────────────────

export const UI = {
  loadingAdmin: 'Verifying Admin Access...',
  notFound404: {
    code: '404',
    heading: 'Page Not Found',
    body: 'The jersey or page you are looking for does not exist in our stadium collection.',
    cta: 'Return to Home Pitch',
  },
  stockAdjust: {
    modalTitle: 'Safe Stock Adjustment',
    variantLabel: 'Jersey Variant',
    currentStockLabel: 'Current Stock:',
    addLabel: 'Add Stock',
    subtractLabel: 'Decrease (Sale)',
    setLabel: 'Set Exact',
    addQtyLabel: 'Units to Add',
    subtractQtyLabel: 'Units Sold / Removed',
    setQtyLabel: 'Set Exact Stock Quantity',
    projectedLabel: 'Resulting Stock:',
    reasonLabel: 'Reason for Adjustment',
    reasonPlaceholder: 'e.g., WhatsApp sale confirmed (#GH-105) or Supplier restock',
    reasonRequired: 'Please provide a reason for this inventory adjustment (e.g., Sale confirmed, Restock shipment).',
    noChangeError: 'No quantity change detected.',
    confirmLabel: 'Confirm Safe Update',
    cancelLabel: 'Cancel',
  },
  sizeSelector: {
    selectLabel: 'Select Size',
    selectedPrefix: 'Selected:',
    pleaseChoose: 'Please choose a size',
    soldOut: 'Sold Out',
    lowStockSuffix: 'left',
    inStock: 'In Stock',
    noVariantsMessage: 'No size variants registered for this jersey.',
  },
  whatsappButton: {
    readyLabel: 'Order on WhatsApp',
    disabledLabel: 'Select Available Size to Order',
  },
  productCard: {
    featuredLabel: 'Featured',
    soldOutLabel: 'Sold Out',
    restockNote: 'Restock via WhatsApp',
    inStockLabel: 'In stock',
    outOfStockLabel: 'Out of stock',
    priceLabel: 'Price',
    orderLabel: 'Order',
    detailsLabel: 'View',
    defaultSeason: '2024/25',
    fallbackImageUrl:
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
  },
};
