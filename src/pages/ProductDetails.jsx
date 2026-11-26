import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, Plus, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import { ImageGallery } from '../components/products/ImageGallery';
import { SizeSelector } from '../components/products/SizeSelector';
import { WhatsAppButton } from '../components/products/WhatsAppButton';
import { ProductCard } from '../components/products/ProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/common/SEOHead';
import { PRODUCT_DETAIL } from '../config/content';

const ICON_MAP = { ShieldCheck, Truck };

export function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const item = await productService.getProductBySlug(slug);
        if (!item) {
          setError('Jersey not found');
          return;
        }
        setProduct(item);

        const firstAvailable = (item.variants || []).find((v) => v.stock_quantity > 0);
        if (firstAvailable) {
          setSelectedSize(firstAvailable.size);
        } else if (item.variants?.length > 0) {
          setSelectedSize(item.variants[0].size);
        }

        setQuantity(1);

        const all = await productService.getProducts({ team: item.team });
        setRelatedProducts(all.filter((p) => p.id !== item.id).slice(0, 4));
      } catch (err) {
        setError(err.message || 'Error loading product details');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  const Shell = ({ children }) => (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );

  if (loading) {
    return (
      <Shell>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 grid lg:grid-cols-12 gap-8 lg:gap-12" role="status" aria-label="Loading jersey">
          <div className="lg:col-span-7 skeleton aspect-[4/5] rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-12 w-4/5 rounded" />
            <div className="skeleton h-10 w-1/4 rounded" />
            <div className="skeleton h-40 w-full rounded-xl" />
          </div>
        </main>
      </Shell>
    );
  }

  if (error || !product) {
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="font-display text-6xl font-black uppercase tracking-wide text-turf mb-2">
            {PRODUCT_DETAIL.notFound.heading}
          </h1>
          <p className="text-ink-soft text-[15px] mb-7 max-w-sm">{PRODUCT_DETAIL.notFound.body}</p>
          <Link
            to="/products"
            className="px-6 py-3.5 rounded-xl bg-turf hover:bg-turf-mid text-chalk font-semibold text-sm transition-colors"
          >
            {PRODUCT_DETAIL.notFound.ctaLabel}
          </Link>
        </div>
      </Shell>
    );
  }

  const variants = product.variants || [];
  const selectedVariant = variants.find((v) => v.size === selectedSize);
  const availableStockForVariant = selectedVariant ? selectedVariant.stock_quantity : 0;
  const isOutOfStock = availableStockForVariant === 0;
  const total = (product.price || 0) * quantity;

  const handleIncrement = () => {
    if (quantity < availableStockForVariant) setQuantity((q) => q + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <SEOHead
        title={product.name}
        description={product.description || `${product.team} football jersey. Order on WhatsApp with stock guarantee.`}
        image={product.images?.[0]?.image_url}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-28 lg:pb-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-mute mb-5 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/products" className="hover:text-turf font-medium">{PRODUCT_DETAIL.backLabel}</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to={`/products?team=${encodeURIComponent(product.team)}`} className="hover:text-turf font-medium">
            {product.team}
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Buying panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className={`px-2.5 py-1 rounded-md ${product.jersey_type === 'Retro' ? 'bg-caution text-ink' : 'bg-turf text-chalk'}`}>
                {product.jersey_type}
              </span>
              {product.season && (
                <span className="px-2.5 py-1 rounded-md border border-line bg-chalk text-ink-soft">{product.season}</span>
              )}
              {product.sku && (
                <span className="text-ink-mute font-medium ml-auto">
                  {PRODUCT_DETAIL.skuPrefix} {product.sku}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight leading-[0.92] text-turf">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-5xl font-extrabold leading-none text-ink">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-ink-mute">{PRODUCT_DETAIL.priceDisclaimer}</span>
            </div>

            <div className="halfway text-turf my-6" />

            <SizeSelector
              variants={variants}
              selectedSize={selectedSize}
              onSelectSize={(size) => {
                setSelectedSize(size);
                setQuantity(1);
              }}
            />

            {/* Quantity + live stock */}
            <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{PRODUCT_DETAIL.quantityLabel}</span>
                <div className="flex items-center rounded-lg border-2 border-ink/20 bg-chalk overflow-hidden">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={handleDecrement}
                    className="w-10 h-10 flex items-center justify-center text-ink hover:bg-paper disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-base select-none" aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= availableStockForVariant || isOutOfStock}
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center text-ink hover:bg-paper disabled:opacity-30 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedVariant && (
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                    isOutOfStock ? 'text-sendoff' : 'text-turf-soft'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>{PRODUCT_DETAIL.stock.outOfStockLabel} {selectedSize}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{availableStockForVariant} {PRODUCT_DETAIL.stock.availableLabel} {selectedSize}</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Desktop order block (mobile uses the bottom bar) */}
            <div className="hidden lg:block mt-7">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm text-ink-soft">
                  {PRODUCT_DETAIL.subtotalPrefix} ({quantity} × {formatPrice(product.price)})
                </span>
                <span className="font-display text-3xl font-extrabold text-ink leading-none">{formatPrice(total)}</span>
              </div>
              <WhatsAppButton
                product={product}
                variant={selectedVariant}
                quantity={quantity}
                disabled={isOutOfStock || !selectedVariant}
              />
            </div>
            <p className="mt-3 text-xs text-ink-mute leading-relaxed">{PRODUCT_DETAIL.whatsappNote}</p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink-soft">
              {PRODUCT_DETAIL.guarantees.map(({ icon, label }) => {
                const Icon = ICON_MAP[icon];
                return (
                  <li key={icon} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-turf shrink-0" />
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>

            {product.description && (
              <div className="mt-7 pt-6 border-t border-line">
                <h2 className="text-sm font-semibold text-ink mb-2">{PRODUCT_DETAIL.descriptionSectionLabel}</h2>
                <p className="text-[15px] text-ink-soft leading-relaxed whitespace-pre-line max-w-prose">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="halfway text-turf mb-8" />
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-wide text-turf leading-none mb-6">
              {PRODUCT_DETAIL.relatedSectionPrefix} {product.team}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Mobile order bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-chalk/95 backdrop-blur-md border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3">
        <div className="shrink-0">
          <div className="font-display text-3xl font-extrabold leading-none text-ink">{formatPrice(total)}</div>
          <div className="text-[11px] text-ink-mute mt-1">
            {selectedSize ? `Size ${selectedSize} × ${quantity}` : PRODUCT_DETAIL.subtotalPrefix}
          </div>
        </div>
        <WhatsAppButton
          size="bar"
          product={product}
          variant={selectedVariant}
          quantity={quantity}
          disabled={isOutOfStock || !selectedVariant}
        />
      </div>
    </div>
  );
}
