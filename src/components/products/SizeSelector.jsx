import React from 'react';
import { UI } from '../../config/content';

const S = UI.sizeSelector;

export function SizeSelector({ variants = [], selectedSize, onSelectSize }) {
  if (!variants || variants.length === 0) {
    return (
      <div className="p-3 bg-chalk border border-line rounded-lg text-sm text-ink-soft">
        {S.noVariantsMessage}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5">
        <h2 className="text-sm font-semibold text-ink">{S.selectLabel}</h2>
        <span className="text-sm text-ink-mute">
          {selectedSize ? `${S.selectedPrefix} ${selectedSize}` : S.pleaseChoose}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" role="group" aria-label={S.selectLabel}>
        {variants.map((variant) => {
          const isSelected = selectedSize === variant.size;
          const isAvailable = variant.stock_quantity > 0;
          const isLowStock = isAvailable && variant.stock_quantity <= 3;

          return (
            <button
              key={variant.id || variant.size}
              type="button"
              disabled={!isAvailable}
              aria-pressed={isSelected}
              onClick={() => isAvailable && onSelectSize(variant.size)}
              className={`relative flex flex-col items-center justify-center h-[4.25rem] rounded-lg border-2 select-none transition-colors ${
                isSelected
                  ? 'border-turf bg-turf text-chalk'
                  : isAvailable
                  ? 'border-ink/20 bg-chalk text-ink hover:border-turf'
                  : 'border-dashed border-line bg-transparent text-ink-mute/70 cursor-not-allowed'
              }`}
            >
              <span
                className={`font-display text-[1.7rem] font-extrabold leading-none ${
                  !isAvailable ? 'line-through decoration-2' : ''
                }`}
              >
                {variant.size}
              </span>
              <span
                className={`text-[11px] font-semibold mt-1 leading-none ${
                  !isAvailable
                    ? 'text-ink-mute'
                    : isLowStock
                    ? isSelected
                      ? 'text-caution'
                      : 'text-[#8A5A00]'
                    : isSelected
                    ? 'text-chalk/75'
                    : 'text-ink-mute'
                }`}
              >
                {!isAvailable
                  ? S.soldOut
                  : isLowStock
                  ? `${variant.stock_quantity} ${S.lowStockSuffix}`
                  : S.inStock}
              </span>
              {isSelected && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-caution" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
