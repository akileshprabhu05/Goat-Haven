import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { buildWhatsAppInquiryURL } from '../../services/whatsappService';
import { Crest } from '../common/Crest';
import {
  NAV_LINKS,
  LOGO_SUBTITLE,
  WHATSAPP_NAV_LABEL_MOBILE,
} from '../../config/content';

// `overlayHero` is kept for API compatibility with older pages; the bar is now always solid.
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isLinkActive = (path) => {
    const currentFull = `${location.pathname}${location.search}`;
    if (path === '/') return location.pathname === '/';
    if (path.includes('?')) return currentFull === path;
    return location.pathname === path && !location.search;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 md:gap-2.5" aria-label={`${BRAND_CONFIG.shortName} home`}>
            <Crest className="w-7 h-8 md:w-8 md:h-9" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl md:text-[1.65rem] font-black uppercase tracking-wide text-turf">
                {BRAND_CONFIG.name}
              </span>
              <span className="hidden md:block text-[11px] font-medium text-ink-mute mt-0.5">{LOGO_SUBTITLE}</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                    active ? 'text-turf' : 'text-ink-soft hover:text-turf'
                  }`}
                >
                  {link.name}
                  {active && <span className="absolute left-3.5 right-3.5 -bottom-[13px] h-[3px] bg-turf rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Desktop WhatsApp */}
          <a
            href={buildWhatsAppInquiryURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-turf text-chalk text-sm font-semibold hover:bg-turf-mid transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-wa flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-ink fill-ink" />
            </span>
            <span>{WHATSAPP_NAV_LABEL_MOBILE}</span>
          </a>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={buildWhatsAppInquiryURL()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={WHATSAPP_NAV_LABEL_MOBILE}
              className="w-9 h-9 rounded-full bg-wa text-ink flex items-center justify-center active:scale-95 transition-transform"
            >
              <MessageCircle className="w-4 h-4 fill-ink" />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full border border-line bg-chalk text-ink flex items-center justify-center"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <nav
          className="md:hidden bg-paper border-t border-line px-4 py-1.5 animate-slide-in"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between py-2.5 border-b border-line last:border-b-0 text-sm font-semibold ${
                  active ? 'text-turf' : 'text-ink-soft'
                }`}
              >
                <span>{link.name}</span>
                {active && <span className="w-2 h-2 rounded-full bg-caution ring-2 ring-turf" />}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
