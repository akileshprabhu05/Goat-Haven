import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-10 h-10' };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`} role="status" aria-label="Loading">
      <Loader2 className={`${sizeMap[size]} text-brand-accent animate-spin`} />
    </div>
  );
}
