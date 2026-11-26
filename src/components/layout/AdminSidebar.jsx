import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Shirt, Boxes, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BRAND_CONFIG } from '../../config/brand';
import { ADMIN_NAV, ADMIN_SIDEBAR } from '../../config/content';
import { Crest } from '../common/Crest';

const ICON_MAP = { LayoutDashboard, Shirt, Boxes };

export function AdminSidebar({ isOpen, onClose }) {
  const { signOut, user } = useAuth();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-[4.5rem] px-5 flex items-center border-b border-zinc-800">
          <Link to="/admin" className="flex items-center gap-3">
            <Crest className="w-8 h-9" tone="light" />
            <div className="leading-none">
              <span className="block font-display font-black text-2xl uppercase tracking-wide text-white">
                {BRAND_CONFIG.shortName}
              </span>
              <span className="block text-xs font-medium text-brand-glow mt-1">{ADMIN_SIDEBAR.consoleBadge}</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Admin">
          {ADMIN_NAV.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-[15px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-caution'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`
                }
              >
                {Icon && <Icon className="w-[18px] h-[18px]" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <span>{ADMIN_SIDEBAR.viewStoreLabel}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          <div className="px-3 py-2">
            <p className="text-xs text-zinc-500">{ADMIN_SIDEBAR.loggedInAs}</p>
            <p className="text-sm font-medium text-zinc-200 truncate">
              {user?.email || ADMIN_SIDEBAR.fallbackEmail}
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{ADMIN_SIDEBAR.signOutLabel}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
