import { buildWhatsAppOrderURL } from './src/services/whatsappService.js';
import { formatPrice } from './src/utils/formatPrice.js';
import { slugify } from './src/utils/slugify.js';

console.log('--- RUNNING GOAT HAVEN UNIT VALIDATION TESTS ---');

// Test 1: Slugify
const testSlug = slugify('Real Madrid 2024/25 Home Kit (Special Edition)');
console.log('Test 1 - Slugify output:', testSlug);
if (testSlug !== 'real-madrid-202425-home-kit-special-edition') {
  console.error('Slugify test failed');
  process.exit(1);
}
console.log('✓ Test 1: Slugify passed.');

// Test 2: Price Formatting
const priceTest = formatPrice(2499);
console.log('Test 2 - Price format output:', priceTest);
if (!priceTest.includes('2,499')) {
  console.error('Price format test failed');
  process.exit(1);
}
console.log('✓ Test 2: Price format passed.');

// Test 3: WhatsApp Click to Chat URL Generation
const sampleProduct = {
  id: 'a1000000-0000-0000-0000-000000000001',
  name: 'Real Madrid 2024/25 Home Kit',
  sku: 'RM-2425-H',
  price: 2499,
};

const sampleVariant = {
  id: 'var-1-2',
  size: 'M',
  sku: 'RM-2425-H-M',
  stock_quantity: 12,
};

const whatsappUrl = buildWhatsAppOrderURL({
  product: sampleProduct,
  variant: sampleVariant,
  quantity: 2,
  customNumber: '919876543210'
});

console.log('Test 3 - Generated WhatsApp Order URL:\n', whatsappUrl);

// Assertions on WhatsApp URL
if (!whatsappUrl.startsWith('https://wa.me/919876543210?text=')) {
  console.error('WhatsApp URL prefix failed');
  process.exit(1);
}

const decodedMessage = decodeURIComponent(whatsappUrl.split('?text=')[1]);
console.log('\nDecoded Message Template:\n' + decodedMessage + '\n');

if (!decodedMessage.includes('Real Madrid 2024/25 Home Kit')) throw new Error('Missing product name');
if (!decodedMessage.includes('Size:* M')) throw new Error('Missing size');
if (!decodedMessage.includes('Quantity:* 2')) throw new Error('Missing quantity');
if (!decodedMessage.includes('RM-2425-H-M')) throw new Error('Missing SKU');
if (!decodedMessage.includes('confirm stock availability and share payment/delivery details')) throw new Error('Missing call to action');

console.log('✓ Test 3: WhatsApp Order URL verification passed.');

console.log('\n🎉 ALL VALIDATION CHECKS PASSED SUCCESSFULLY!');
