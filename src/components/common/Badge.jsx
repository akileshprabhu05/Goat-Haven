import React from 'react';

export function Badge({
  children,
  variant = 'default', // default | success | warning | danger | accent | gold
  size = 'md', // sm | md
  className = '',
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    success: 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-950/70 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-950/70 text-rose-400 border border-rose-500/30',
    accent: 'bg-emerald-900/40 text-brand-glow border border-brand-glow/30',
    gold: 'bg-yellow-950/60 text-caution border border-caution/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
