import { BRAND_CONFIG } from '../config/brand.js';
import { WHATSAPP_CONTENT } from '../config/content.js';
import { formatPrice } from '../utils/formatPrice.js';

const T = WHATSAPP_CONTENT.orderTemplate;

/**
 * Generates an official WhatsApp Click to Chat URL with a prefilled, structured order message.
 *
 * Format:
 * https://wa.me/PHONE_NUMBER?text=ENCODED_MESSAGE
 *
 * @param {Object} params
 * @param {Object} params.product - Product data object
 * @param {Object} params.variant - Selected variant with size & sku
 * @param {number} params.quantity - Order quantity
 * @param {string} [params.customNumber] - Optional override for seller phone
 * @returns {string} Fully encoded WhatsApp URL
 */
export function buildWhatsAppOrderURL({ product, variant, quantity, customNumber }) {
  const sellerNumber = (customNumber || BRAND_CONFIG.whatsappNumber || '').replace(/[^\d]/g, '');

  if (!product || !variant) {
    throw new Error(WHATSAPP_CONTENT.missingSelectionError);
  }

  const unitPrice = parseFloat(product.price) || 0;
  const qty = parseInt(quantity, 10) || 1;
  const totalPrice = unitPrice * qty;
  const skuIdentifier = variant.sku || product.sku || `SKU-${product.id?.slice(0, 8) || 'GEN'}`;

  const message = [
    T.header(BRAND_CONFIG.name),
    T.divider,
    `${T.productLabel} ${product.name}`,
    `${T.skuLabel} ${skuIdentifier}`,
    `${T.sizeLabel} ${variant.size}`,
    `${T.quantityLabel} ${qty}`,
    `${T.unitPriceLabel} ${formatPrice(unitPrice)}`,
    `${T.totalPriceLabel} ${formatPrice(totalPrice)}`,
    T.divider,
    T.closingLine1,
    T.closingLine2,
  ].join('\n');

  return `https://wa.me/${sellerNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Direct inquiry WhatsApp link for general questions
 */
export function buildWhatsAppInquiryURL(customMessage) {
  const sellerNumber = (BRAND_CONFIG.whatsappNumber || '').replace(/[^\d]/g, '');
  const message = customMessage || WHATSAPP_CONTENT.fallbackInquiry(BRAND_CONFIG.name);
  return `https://wa.me/${sellerNumber}?text=${encodeURIComponent(message)}`;
}
