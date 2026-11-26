/**
 * Local / Offline Seed Data
 * ─────────────────────────
 * Used as the initial dataset in localStorage when Supabase
 * environment variables are not configured.
 */

export const INITIAL_LOCAL_PRODUCTS = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Real Madrid 2024/25 Home Kit',
    slug: 'real-madrid-2024-25-home-kit',
    description:
      'The iconic all-white Los Blancos home kit featuring subtle houndstooth texture, gold-accented sponsor detailing, and high-performance moisture-wicking AEROREADY fabric. Tailored for champions.',
    team: 'Real Madrid',
    season: '2024/25',
    jersey_type: 'Home',
    price: 2499.0,
    sku: 'RM-2425-H',
    is_active: true,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    images: [
      {
        id: 'img-1-1',
        image_url:
          'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
      {
        id: 'img-1-2',
        image_url:
          'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80',
        display_order: 1,
      },
    ],
    variants: [
      { id: 'var-1-1', size: 'S', sku: 'RM-2425-H-S', stock_quantity: 5 },
      { id: 'var-1-2', size: 'M', sku: 'RM-2425-H-M', stock_quantity: 12 },
      { id: 'var-1-3', size: 'L', sku: 'RM-2425-H-L', stock_quantity: 8 },
      { id: 'var-1-4', size: 'XL', sku: 'RM-2425-H-XL', stock_quantity: 3 },
      { id: 'var-1-5', size: 'XXL', sku: 'RM-2425-H-XXL', stock_quantity: 0 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Arsenal 2024/25 Away Black Kit',
    slug: 'arsenal-2024-25-away-kit',
    description:
      'Stunning midnight black aesthetic celebrated in collaboration with Labrum London, honoring the African diaspora in North London. Features vibrant red and green accents along collar and cuffs.',
    team: 'Arsenal',
    season: '2024/25',
    jersey_type: 'Away',
    price: 2299.0,
    sku: 'ARS-2425-A',
    is_active: true,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    images: [
      {
        id: 'img-2-1',
        image_url:
          'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
      {
        id: 'img-2-2',
        image_url:
          'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80',
        display_order: 1,
      },
    ],
    variants: [
      { id: 'var-2-1', size: 'S', sku: 'ARS-2425-A-S', stock_quantity: 4 },
      { id: 'var-2-2', size: 'M', sku: 'ARS-2425-A-M', stock_quantity: 15 },
      { id: 'var-2-3', size: 'L', sku: 'ARS-2425-A-L', stock_quantity: 9 },
      { id: 'var-2-4', size: 'XL', sku: 'ARS-2425-A-XL', stock_quantity: 2 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Manchester City 2024/25 Oasis Special Edition',
    slug: 'man-city-2024-25-oasis-kit',
    description:
      'Definitely Maybe 30th Anniversary edition co-designed by rock icon Noel Gallagher. Muted wheat and marine blue accents with distinct typography and collector badging.',
    team: 'Manchester City',
    season: '2024/25',
    jersey_type: 'Special',
    price: 2699.0,
    sku: 'MC-2425-SP',
    is_active: true,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    images: [
      {
        id: 'img-3-1',
        image_url:
          'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
    ],
    variants: [
      { id: 'var-3-1', size: 'M', sku: 'MC-2425-SP-M', stock_quantity: 7 },
      { id: 'var-3-2', size: 'L', sku: 'MC-2425-SP-L', stock_quantity: 6 },
      { id: 'var-3-3', size: 'XL', sku: 'MC-2425-SP-XL', stock_quantity: 0 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    name: 'FC Barcelona 1999/00 Centenary Retro Kit',
    slug: 'barcelona-1999-00-centenary-retro',
    description:
      'Legendary half-and-half Blaugrana design celebrating 100 years of FC Barcelona (1899-1999). Gold embroidered centenary crest and classic oversized polo collar. Rivaldo era grail.',
    team: 'FC Barcelona',
    season: '1999/00',
    jersey_type: 'Retro',
    price: 2899.0,
    sku: 'FCB-9900-RETRO',
    is_active: true,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    images: [
      {
        id: 'img-4-1',
        image_url:
          'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
    ],
    variants: [
      { id: 'var-4-1', size: 'S', sku: 'FCB-9900-RET-S', stock_quantity: 2 },
      { id: 'var-4-2', size: 'M', sku: 'FCB-9900-RET-M', stock_quantity: 10 },
      { id: 'var-4-3', size: 'L', sku: 'FCB-9900-RET-L', stock_quantity: 5 },
      { id: 'var-4-4', size: 'XL', sku: 'FCB-9900-RET-XL', stock_quantity: 1 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    name: 'AC Milan 2024/25 Third Kit',
    slug: 'ac-milan-2024-25-third-kit',
    description:
      'Monochromatic shadow grey and pastel mint details embody modern Milanese jersey design. Engineered lightweight jacquard fabric with silicone 3D club crest.',
    team: 'AC Milan',
    season: '2024/25',
    jersey_type: 'Third',
    price: 2199.0,
    sku: 'ACM-2425-T',
    is_active: true,
    is_featured: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    images: [
      {
        id: 'img-5-1',
        image_url:
          'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
    ],
    variants: [
      { id: 'var-5-1', size: 'M', sku: 'ACM-2425-T-M', stock_quantity: 6 },
      { id: 'var-5-2', size: 'L', sku: 'ACM-2425-T-L', stock_quantity: 8 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    name: 'Inter Miami 2024 Home Pink Jersey',
    slug: 'inter-miami-2024-home-pink',
    description:
      'The world-famous vibrant pink "La Noche" kit worn by Lionel Messi. Centered club badge, high-density heat-pressed silicone MLS shield, breathable mesh side panels.',
    team: 'Inter Miami',
    season: '2024',
    jersey_type: 'Home',
    price: 2399.0,
    sku: 'IM-2024-H',
    is_active: true,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    images: [
      {
        id: 'img-6-1',
        image_url:
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
    ],
    variants: [
      { id: 'var-6-1', size: 'S', sku: 'IM-2024-H-S', stock_quantity: 8 },
      { id: 'var-6-2', size: 'M', sku: 'IM-2024-H-M', stock_quantity: 20 },
      { id: 'var-6-3', size: 'L', sku: 'IM-2024-H-L', stock_quantity: 14 },
      { id: 'var-6-4', size: 'XL', sku: 'IM-2024-H-XL', stock_quantity: 4 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000007',
    name: 'France 1998 World Cup Retro Jersey',
    slug: 'france-1998-world-cup-retro',
    description:
      "The historic tricolor masterpiece worn by Zinedine Zidane during France's maiden World Cup triumph. Distinct red chest band, white racing stripes, and gold star embroidery.",
    team: 'France National',
    season: '1998',
    jersey_type: 'Retro',
    price: 2999.0,
    sku: 'FRA-1998-RETRO',
    is_active: true,
    is_featured: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    images: [
      {
        id: 'img-7-1',
        image_url:
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
    ],
    variants: [
      { id: 'var-7-1', size: 'M', sku: 'FRA-1998-RET-M', stock_quantity: 3 },
      { id: 'var-7-2', size: 'L', sku: 'FRA-1998-RET-L', stock_quantity: 4 },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000008',
    name: 'Bayern Munich 2024/25 Home All-Red Kit',
    slug: 'bayern-munich-2024-25-home-kit',
    description:
      "Triple shade of red - symbolizing the club's pulse, passion, and Bavarian dominance. Geometric diamond watermark design inspired by the Allianz Arena.",
    team: 'Bayern Munich',
    season: '2024/25',
    jersey_type: 'Home',
    price: 2199.0,
    sku: 'FCB-2425-H',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: 'img-8-1',
        image_url:
          'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=1000&q=80',
        display_order: 0,
      },
    ],
    variants: [
      { id: 'var-8-1', size: 'S', sku: 'FCB-2425-H-S', stock_quantity: 3 },
      { id: 'var-8-2', size: 'M', sku: 'FCB-2425-H-M', stock_quantity: 7 },
      { id: 'var-8-3', size: 'L', sku: 'FCB-2425-H-L', stock_quantity: 5 },
    ],
  },
];

export const INITIAL_LOCAL_ADJUSTMENTS = [
  {
    id: 'adj-001',
    variant_id: 'var-1-2',
    product_name: 'Real Madrid 2024/25 Home Kit',
    size: 'M',
    previous_quantity: 8,
    change_quantity: 4,
    new_quantity: 12,
    reason: 'Restock shipment from Valencia supplier',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    admin_email: 'owner@goathaven.com',
  },
  {
    id: 'adj-002',
    variant_id: 'var-2-2',
    product_name: 'Arsenal 2024/25 Away Black Kit',
    size: 'M',
    previous_quantity: 16,
    change_quantity: -1,
    new_quantity: 15,
    reason: 'WhatsApp sale verified & dispatched (Order #GH-104)',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    admin_email: 'owner@goathaven.com',
  },
];
