import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppOrderURL } from '../../services/whatsappService';
import { UI } from '../../config/content';

const W = UI.whatsappButton;

export function WhatsAppButton({
  product,
  variant,
  quantity = 1,
  disabled = false,
  size = 'lg', // lg | bar
  className = '',
}) {
  const handleClick = (e) => {
    e.preventDefault();
    if (disabled || !variant) return;

    try {
      const url = buildWhatsAppOrderURL({ product, variant, quantity });
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      alert(err.message || 'Could not launch WhatsApp order.');
    }
  };

  const isDisabled = disabled || !variant;
  const sizeClass = size === 'bar' ? 'py-3 px-4 text-sm' : 'py-4 px-6 text-base';

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={`w-full rounded-xl font-bold leading-tight flex items-center justify-center gap-2.5 transition-colors select-none ${sizeClass} ${
        isDisabled
          ? 'bg-ink/10 text-ink-mute cursor-not-allowed'
          : 'bg-wa hover:bg-[#20ba59] text-ink active:translate-y-px cursor-pointer'
      } ${className}`}
    >
      <MessageCircle className={`shrink-0 ${isDisabled ? '' : 'fill-ink'} ${size === 'bar' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <span>{isDisabled ? W.disabledLabel : W.readyLabel}</span>
    </button>
  );
}
