-- ==============================================================================
-- GOAT HAVEN - SEED DATA FOR DEMO & TESTING
-- File: supabase/seed.sql
-- ==============================================================================

-- 1. Insert Initial Jerseys
INSERT INTO public.products (id, name, slug, description, team, season, jersey_type, price, sku, is_active, is_featured)
VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'Real Madrid 2024/25 Home Kit',
  'real-madrid-2024-25-home-kit',
  'The iconic all-white Los Blancos home kit featuring subtle houndstooth texture, gold-accented sponsor detailing, and high-performance moisture-wicking AEROREADY fabric. Tailored for champions.',
  'Real Madrid',
  '2024/25',
  'Home',
  2499.00,
  'RM-2425-H',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Arsenal 2024/25 Away Black Kit',
  'arsenal-2024-25-away-kit',
  'Stunning midnight black aesthetic celebrated in collaboration with Labrum London, honoring the African diaspora in North London. Features vibrant red and green accents along collar and cuffs.',
  'Arsenal',
  '2024/25',
  'Away',
  2299.00,
  'ARS-2425-A',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Manchester City 2024/25 Oasis 4th Kit',
  'man-city-2024-25-oasis-kit',
  'Definitely Maybe 30th Anniversary edition co-designed by rock icon Noel Gallagher. Muted wheat and marine blue accents with distinct typography and collector badging.',
  'Manchester City',
  '2024/25',
  'Special',
  2699.00,
  'MC-2425-SP',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000004',
  'FC Barcelona 1999/00 Centenary Retro Kit',
  'barcelona-1999-00-centenary-retro',
  'Legendary half-and-half Blaugrana design celebrating 100 years of FC Barcelona (1899-1999). Gold embroidered centenary crest and classic oversized polo collar. Rivaldo era grail.',
  'FC Barcelona',
  '1999/00',
  'Retro',
  2899.00,
  'FCB-9900-RETRO',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000005',
  'AC Milan 2024/25 Third Kit',
  'ac-milan-2024-25-third-kit',
  'Monochromatic shadow grey and pastel mint details embody Milanese haute-couture street fashion. Engineered lightweight jacquard fabric with silicone 3D club crest.',
  'AC Milan',
  '2024/25',
  'Third',
  2199.00,
  'ACM-2425-T',
  true,
  false
),
(
  'a1000000-0000-0000-0000-000000000006',
  'Inter Miami 2024 Home Pink Jersey',
  'inter-miami-2024-home-pink',
  'The world-famous vibrant pink "La Noche" kit worn by Lionel Messi. Centered club badge, high-density heat-pressed silicone MLS shield, breathable mesh side panels.',
  'Inter Miami',
  '2024',
  'Home',
  2399.00,
  'IM-2024-H',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000007',
  'France 1998 World Cup Retro Jersey',
  'france-1998-world-cup-retro',
  'The historic tricolor masterpiece worn by Zinedine Zidane during France''s maiden World Cup triumph. Distinct red chest band, white racing stripes, and gold star embroidery.',
  'France National',
  '1998',
  'Retro',
  2999.00,
  'FRA-1998-RETRO',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000008',
  'Bayern Munich 2024/25 Home All-Red Kit',
  'bayern-munich-2024-25-home-kit',
  'Triple shade of red - symbolizing the club''s pulse, passion, and Bavarian dominance. Geometric diamond watermark design inspired by the Allianz Arena.',
  'Bayern Munich',
  '2024/25',
  'Home',
  2199.00,
  'FCB-2425-H',
  true,
  false
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Images (Unsplash high-res football jersey photos & placeholders)
INSERT INTO public.product_images (product_id, image_url, display_order)
VALUES
-- Real Madrid
('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1000&q=80', 0),
('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80', 1),
-- Arsenal Away
('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80', 0),
('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80', 1),
-- Man City
('a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80', 0),
-- Barcelona Retro
('a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1000&q=80', 0),
-- AC Milan
('a1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80', 0),
-- Inter Miami
('a1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80', 0),
-- France 98
('a1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80', 0),
-- Bayern Munich
('a1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=1000&q=80', 0)
ON CONFLICT DO NOTHING;

-- 3. Insert Product Variants (Sizes & Stock levels demonstrating inventory management)
-- Real Madrid: S: 5, M: 12, L: 8, XL: 3, XXL: 0
INSERT INTO public.product_variants (product_id, size, sku, stock_quantity)
VALUES
('a1000000-0000-0000-0000-000000000001', 'S',   'RM-2425-H-S',   5),
('a1000000-0000-0000-0000-000000000001', 'M',   'RM-2425-H-M',   12),
('a1000000-0000-0000-0000-000000000001', 'L',   'RM-2425-H-L',   8),
('a1000000-0000-0000-0000-000000000001', 'XL',  'RM-2425-H-XL',  3),
('a1000000-0000-0000-0000-000000000001', 'XXL', 'RM-2425-H-XXL', 0),

-- Arsenal Away
('a1000000-0000-0000-0000-000000000002', 'S',   'ARS-2425-A-S',   4),
('a1000000-0000-0000-0000-000000000002', 'M',   'ARS-2425-A-M',   15),
('a1000000-0000-0000-0000-000000000002', 'L',   'ARS-2425-A-L',   9),
('a1000000-0000-0000-0000-000000000002', 'XL',  'ARS-2425-A-XL',  2),

-- Man City Oasis
('a1000000-0000-0000-0000-000000000003', 'M',   'MC-2425-SP-M',   7),
('a1000000-0000-0000-0000-000000000003', 'L',   'MC-2425-SP-L',   6),
('a1000000-0000-0000-0000-000000000003', 'XL',  'MC-2425-SP-XL',  0),

-- Barcelona Centenary Retro
('a1000000-0000-0000-0000-000000000004', 'S',   'FCB-9900-RET-S', 2),
('a1000000-0000-0000-0000-000000000004', 'M',   'FCB-9900-RET-M', 10),
('a1000000-0000-0000-0000-000000000004', 'L',   'FCB-9900-RET-L', 5),
('a1000000-0000-0000-0000-000000000004', 'XL',  'FCB-9900-RET-XL', 1),

-- AC Milan
('a1000000-0000-0000-0000-000000000005', 'M',   'ACM-2425-T-M',   6),
('a1000000-0000-0000-0000-000000000005', 'L',   'ACM-2425-T-L',   8),

-- Inter Miami
('a1000000-0000-0000-0000-000000000006', 'S',   'IM-2024-H-S',   8),
('a1000000-0000-0000-0000-000000000006', 'M',   'IM-2024-H-M',   20),
('a1000000-0000-0000-0000-000000000006', 'L',   'IM-2024-H-L',   14),
('a1000000-0000-0000-0000-000000000006', 'XL',  'IM-2024-H-XL',  4),

-- France 98 Retro
('a1000000-0000-0000-0000-000000000007', 'M',   'FRA-1998-RET-M', 3),
('a1000000-0000-0000-0000-000000000007', 'L',   'FRA-1998-RET-L', 4),

-- Bayern Munich
('a1000000-0000-0000-0000-000000000008', 'S',   'FCB-2425-H-S',   3),
('a1000000-0000-0000-0000-000000000008', 'M',   'FCB-2425-H-M',   7),
('a1000000-0000-0000-0000-000000000008', 'L',   'FCB-2425-H-L',   5)
ON CONFLICT DO NOTHING;
