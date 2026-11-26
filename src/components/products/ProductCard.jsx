import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { buildWhatsAppOrderURL } from '../../services/whatsappService';
import { UI } from '../../config/content';

const C = UI.productCard;
const LOW_STOCK_TOTAL = 5;

export function ProductCard({ product, compact = false }) {
  const primaryImage = product.images?.[0]?.image_url || C.fallbackImageUrl;
  const secondaryImage = product.images?.[1]?.image_url;

  const variants = product.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
  const isOutOfStock = totalStock === 0;
  const isLowStock = !isOutOfStock && totalStock <= LOW_STOCK_TOTAL;
  const firstAvailableVariant = variants.find((v) => v.stock_quantity > 0) || variants[0];

  const handleQuickWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstAvailableVariant || isOutOfStock) return;
    const url = buildWhatsAppOrderURL({ product, variant: firstAvailableVariant, quantity: 1 });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="group relative flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#DFE4D9]">
        <Link
          to={`/products/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`${product.name}, ${formatPrice(product.price)}`}
        >
          <img
            src={primaryImage}
            alt=""
            loading="lazy"
            className={`w-full h-full object-cover object-center ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
          {secondaryImage && !isOutOfStock && (
            <img
              src={secondaryImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </Link>

        {/* Kit type */}
        {product.jersey_type && (
          <span
            className={`pointer-events-none absolute top-2 left-2 rounded-md font-semibold ${
              compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
            } ${product.jersey_type === 'Retro' ? 'bg-caution text-ink' : 'bg-chalk text-ink'}`}
          >
            {product.jersey_type}
          </span>
        )}

        {/* Stock state */}
        {isOutOfStock && (
          <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-sendoff text-white px-2 py-1 text-xs font-bold">
            {C.soldOutLabel}
          </span>
        )}
        {isLowStock && (
          <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-ink text-caution px-2 py-1 text-xs font-bold">
            {compact ? `${totalStock} left` : `Only ${totalStock} left`}
          </span>
        )}

        {/* One-tap WhatsApp order */}
        {!isOutOfStock && firstAvailableVariant && (
          <button
            type="button"
            onClick={handleQuickWhatsApp}
            title={`${C.orderLabel} (${firstAvailableVariant.size})`}
            aria-label={`Order ${product.name} size ${firstAvailableVariant.size} on WhatsApp`}
            className={`absolute bottom-2 right-2 rounded-full bg-wa text-ink flex items-center justify-center shadow-lift hover:bg-[#20ba59] active:scale-95 transition-all ${
              compact ? 'w-8 h-8' : 'w-10 h-10'
            }`}
          >
            <MessageCircle className={compact ? 'w-4 h-4 fill-ink' : 'w-5 h-5 fill-ink'} />
          </button>
        )}
      </div>

      {/* Details */}
      <div className={`flex flex-col ${compact ? 'pt-2' : 'pt-3'}`}>
        <p className={`text-ink-mute truncate ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {product.team}
          {!compact && ` · ${product.season || C.defaultSeason}`}
        </p>

        <Link to={`/products/${product.slug}`} className="mt-0.5">
          <h3
            className={`font-semibold text-ink leading-snug group-hover:underline underline-offset-2 decoration-1 ${
              compact ? 'text-xs line-clamp-1' : 'text-sm sm:text-[15px] line-clamp-2'
            }`}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-end justify-between gap-2">
          <span className={`font-display font-extrabold leading-none text-turf ${compact ? 'text-xl' : 'text-2xl'}`}>
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Size availability, struck through when gone */}
        {!compact && variants.length > 0 && (
          <ul className="flex flex-wrap items-center gap-1 mt-2.5" aria-label="Sizes">
            {variants.slice(0, 5).map((v) => {
              const available = v.stock_quantity > 0;
              return (
                <li
                  key={v.id || v.size}
                  title={available ? `${v.size} in stock` : `${v.size} sold out`}
                  className={`min-w-[1.65rem] text-center text-[11px] font-semibold px-1.5 py-0.5 rounded border ${
                    available
                      ? 'border-ink/30 text-ink'
                      : 'border-line text-ink-mute/70 line-through decoration-1'
                  }`}
                >
                  {v.size}
                </li>
              );
            })}
            {variants.length > 5 && (
              <li className="text-[11px] text-ink-mute font-semibold">+{variants.length - 5}</li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ compact = false }) {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[4/5] rounded-xl" />
      <div className="skeleton h-3 w-1/3 rounded mt-3" />
      <div className="skeleton h-4 w-4/5 rounded mt-2" />
      <div className="skeleton h-6 w-1/4 rounded mt-2" />
      {!compact && <div className="skeleton h-5 w-2/3 rounded mt-3" />}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className = '', compact = false }) {
  return (
    <div className={className} role="status" aria-label="Loading jerseys">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} compact={compact} />
      ))}
    </div>
  );
}
