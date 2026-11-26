import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { buildWhatsAppInquiryURL } from '../../services/whatsappService';
import { Crest } from '../common/Crest';
import { PitchLines } from '../common/PitchLines';
import { FOOTER } from '../../config/content';

const ICON_MAP = { ShieldCheck, MessageCircle, Truck };

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-turf text-chalk/80">
      <PitchLines className="absolute -right-40 -bottom-48 w-[560px] h-[560px] text-chalk/[0.07] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promise strip */}
        <ul className="grid grid-cols-1 md:grid-cols-3 border-b border-chalk/15">
          {FOOTER.featureStrip.map(({ icon, title, body }, i) => {
            const Icon = ICON_MAP[icon];
            return (
              <li
                key={icon}
                className={`flex items-start gap-3.5 py-6 md:py-8 ${
                  i > 0 ? 'border-t md:border-t-0 md:border-l border-chalk/15 md:pl-8' : ''
                } ${i < 2 ? 'md:pr-8' : ''}`}
              >
                <Icon className="w-6 h-6 text-caution shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h4 className="text-chalk font-semibold text-base">{title}</h4>
                  <p className="text-sm text-chalk/65 mt-0.5 max-w-xs">{body}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 py-12">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-3">
              <Crest className="w-10 h-11" tone="light" />
              <span className="font-display text-4xl font-black uppercase tracking-wide text-chalk leading-none">
                {BRAND_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-chalk/70 leading-relaxed mt-4 max-w-sm">
              {BRAND_CONFIG.subTagline} {FOOTER.taglineSuffix}
            </p>
            <a
              href={buildWhatsAppInquiryURL()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-full bg-wa text-ink text-sm font-bold hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-ink" />
              <span>{BRAND_CONFIG.whatsappFormatted}</span>
            </a>
          </div>

          <div className="md:col-span-2 md:col-start-9">
            <h4 className="text-chalk font-semibold text-sm mb-3.5">{FOOTER.columns.exploreHeading}</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER.exploreLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="hover:text-caution transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-chalk font-semibold text-sm mb-3.5">{FOOTER.columns.clubsHeading}</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER.popularClubs.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="hover:text-caution transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-5 border-t border-chalk/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-chalk/55">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>
          <p>{FOOTER.builtByLine}</p>
        </div>
      </div>
    </footer>
  );
}
