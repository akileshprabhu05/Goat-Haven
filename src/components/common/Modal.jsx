import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-shell fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 overflow-y-auto bg-transparent">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${maxWidth} bg-zinc-900 border border-zinc-700/70 rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 z-10 sm:my-8 max-h-[92vh] overflow-y-auto text-zinc-100 animate-slide-in`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h3 className="text-2xl font-display font-extrabold uppercase tracking-wide text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
