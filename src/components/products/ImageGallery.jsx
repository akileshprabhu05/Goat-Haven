import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK =
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1000&q=80';

export function ImageGallery({ images = [], productName = 'Jersey' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images.map((img) => img.image_url || img) : [FALLBACK];
  const count = displayImages.length;
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const go = (dir) => setSelectedIndex((i) => (i + dir + count) % count);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3">
      {/* Thumbnails: row on mobile, column on desktop */}
      {count > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible no-scrollbar lg:w-[72px] shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Show image ${idx + 1} of ${count}`}
              aria-current={selectedIndex === idx}
              className={`relative w-16 h-20 lg:w-[72px] lg:h-[90px] rounded-lg overflow-hidden shrink-0 border-2 transition-colors bg-[#DFE4D9] ${
                selectedIndex === idx ? 'border-turf' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover object-center" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#DFE4D9]">
        <img
          src={currentImage}
          alt={`${productName}, view ${selectedIndex + 1} of ${count}`}
          className="w-full h-full object-cover object-center"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-chalk/90 text-ink flex items-center justify-center shadow-lift hover:bg-chalk"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-chalk/90 text-ink flex items-center justify-center shadow-lift hover:bg-chalk"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 left-3 rounded-md bg-ink/80 text-chalk text-xs font-semibold px-2 py-1">
              {selectedIndex + 1} / {count}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
