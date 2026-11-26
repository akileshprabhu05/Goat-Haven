/**
 * Central Brand and Business Configuration for Goat Haven
 * Change any business or brand details here to update across the entire site.
 */
export const BRAND_CONFIG = {
  name: "GOAT HAVEN",
  shortName: "Goat Haven",
  tagline: "WEAR THE LEGACY",
  subTagline: "Authentic matchday jerseys & iconic retro football classics.",
  
  // WhatsApp Configuration
  // Used for direct customer orders. Format: Country code + phone without + or spaces (e.g. 919876543210)
  whatsappNumber: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) || 
                  (typeof process !== 'undefined' && process.env?.VITE_WHATSAPP_NUMBER) || 
                  "919876543210",
  whatsappFormatted: "+91 98765 43210",
  supportEmail: "orders@goathaven.com",
  
  // Currency & Locale
  currency: {
    symbol: "₹",
    code: "INR",
    locale: "en-IN",
  },
  
  // Business features highlighted on homepage
  features: [
    {
      title: "100% Authentic Quality",
      description: "Player and stadium grade fabrics, official heat-pressed badges, and breathable moisture-wicking weave.",
      icon: "ShieldCheck",
    },
    {
      title: "Direct WhatsApp Ordering",
      description: "No tedious checkouts. Chat directly with the curator, confirm exact size measurements, and track order updates.",
      icon: "MessageCircle",
    },
    {
      title: "Size Guarantee & Precision",
      description: "Live real-time stock allocation for S, M, L, XL, and XXL variants. What you see is strictly what is available.",
      icon: "CheckCircle",
    },
    {
      title: "Fast Dispatched Delivery",
      description: "Orders packaged in bespoke protective zip-pouches with express courier tracking within 24 hours.",
      icon: "Truck",
    },
  ],

  // Socials
  socials: {
    instagram: "https://instagram.com/goathaven_jerseys",
    twitter: "https://twitter.com/goathaven",
    facebook: "https://facebook.com/goathaven",
  },
};
