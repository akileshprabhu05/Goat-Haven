import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout({ children, title, subtitle, action }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen bg-zinc-950 text-zinc-100 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 md:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 min-h-[4.5rem] py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display uppercase tracking-wide text-white leading-none truncate">
                {title}
              </h1>
              {subtitle && <p className="text-sm text-zinc-400 mt-1 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
