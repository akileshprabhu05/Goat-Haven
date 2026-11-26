import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // primary | secondary | outline | ghost | danger | whatsapp | light
  size = 'md', // sm | md | lg
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-colors duration-150 select-none rounded-lg active:translate-y-px disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-brand-accent hover:bg-brand-accentHover text-white',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
    outline: 'bg-transparent border border-zinc-600 hover:border-zinc-400 text-zinc-100 hover:bg-zinc-900',
    ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    whatsapp: 'bg-wa hover:bg-[#20ba59] text-ink',
    light: 'bg-turf hover:bg-turf-mid text-chalk',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing…</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
