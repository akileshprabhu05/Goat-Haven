import { BRAND_CONFIG } from '../config/brand.js';

/**
 * Formats a numeric price using the brand currency config
 * @param {number|string} amount 
 * @returns {string} e.g. "₹2,499.00"
 */
export function formatPrice(amount) {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  
  return new Intl.NumberFormat(BRAND_CONFIG.currency.locale, {
    style: 'currency',
    currency: BRAND_CONFIG.currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
