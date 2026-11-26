# Goat Haven UI refresh

Logic, routes, services and Supabase code are untouched. Only presentation changed.

## Direction
Pitch and kit-room: deep turf green, chalk-line markings, a condensed scoreboard
typeface, and one "yellow card" highlight. The storefront is light (so jerseys
read clearly); the admin console stays dark, re-tinted to the same green.

## Tokens (tailwind.config.js)
- paper / chalk: page and raised surfaces
- turf (+ mid, deep, soft): primary dark green
- ink (+ soft, mute): text on light
- caution (yellow), sendoff (red), wa (WhatsApp green)
- zinc is re-tinted green, so existing admin `zinc-*` classes follow the theme
- brand.accent / brand.glow: admin buttons and accent text on dark

## Fonts
Self-hosted in /public/fonts (no Google Fonts request):
Big Shoulders Display (headlines, prices, sizes) and Hanken Grotesk (body).

## What changed
- New crest logo, favicon, and pitch-line artwork (Crest.jsx, PitchLines.jsx)
- Home: typographic hero with duotone image panel, bento "Shop by kit",
  underline tabs, ruled "why us" list, WhatsApp banner
- Product cards: image-first, live size row with struck-out sold sizes,
  "Only N left" flag, one-tap WhatsApp button, loading skeletons
- Product page: sticky buy panel, kit-tag size selector, mobile bottom order bar
- Catalogue: filter bar with active-filter count
- Admin: new sidebar, login, calmer KPI cards, scrollable tables on phones
- Accessibility: visible focus rings, reduced-motion support, labelled controls

## Run
    pnpm install   # or npm install
    pnpm dev
