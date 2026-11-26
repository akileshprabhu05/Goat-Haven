import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { ANNOUNCEMENT_BAR, HOME, SEO } from '../config/content';
import { productService } from '../services/productService';
import { buildWhatsAppInquiryURL } from '../services/whatsappService';
import { ProductCard, ProductGridSkeleton } from '../components/products/ProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/common/SEOHead';
import { PitchLines } from '../components/common/PitchLines';

const FEATURE_ICONS = { ShieldCheck, MessageCircle, CheckCircle, Truck };
const SLIDE_MS = 6000;

function SectionHead({ title, to, linkLabel }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5 sm:mb-7">
      <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-wide text-turf leading-none">
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-turf shrink-0 pb-1"
        >
          <span>{linkLabel}</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function Home() {
  const [featuredJerseys, setFeaturedJerseys] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [featured, allProds, teamList] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getProducts(),
          productService.getTeams(),
        ]);
        setFeaturedJerseys(featured.slice(0, HOME.featured.maxItems));
        setAllProducts(allProds);
        setTeams(teamList);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const goToSlide = useCallback((idx) => setActiveSlide(idx), []);

  // Auto-advance; restarts whenever the slide changes (manual or automatic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((current) => (current + 1) % HOME.heroSlides.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [activeSlide]);

  const filteredTabProducts = (
    activeTab === 'all'
      ? allProducts
      : allProducts.filter((p) => p.jersey_type?.toLowerCase() === activeTab.toLowerCase())
  ).slice(0, HOME.trendingTabs.maxItems);

  const [bigTile, ...smallTiles] = HOME.kitCategories.items;

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <SEOHead title={SEO.home.title} description={SEO.home.description} />

      {/* Announcement bar */}
      <div className="on-dark bg-turf-deep text-chalk/90 overflow-hidden py-2">
        <div className="animate-marquee items-center gap-12 text-[13px] font-medium whitespace-nowrap">
          {[...ANNOUNCEMENT_BAR, ...ANNOUNCEMENT_BAR, ...ANNOUNCEMENT_BAR, ...ANNOUNCEMENT_BAR].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-12">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-caution" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-turf text-chalk">
        <PitchLines className="absolute -left-56 -bottom-72 w-[760px] h-[760px] text-chalk/[0.08] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy: every slide sits in the same grid cell so the height never jumps */}
          <div className="lg:col-span-7">
            <div className="grid">
              {HOME.heroSlides.map((slide, idx) => {
                const active = idx === activeSlide;
                return (
                  <div
                    key={slide.id}
                    aria-hidden={!active}
                    className={`col-start-1 row-start-1 transition-[opacity,visibility] duration-500 ${
                      active ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                  >
                    <h1 className="font-display font-extrabold uppercase tracking-tight leading-[0.84] text-[clamp(4.5rem,21vw,10.5rem)]">
                      <span className="block">{slide.headline}</span>
                      <span className="block pl-[0.55em]">{slide.headlineAccent}</span>
                    </h1>

                    <p className="mt-5 sm:mt-6 text-base sm:text-lg text-chalk/80 max-w-md leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Link
                        to={slide.ctaPath}
                        tabIndex={active ? 0 : -1}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-caution text-ink font-bold text-[15px] hover:bg-[#ffe04d] transition-colors"
                      >
                        <span>{slide.ctaLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href={buildWhatsAppInquiryURL()}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={active ? 0 : -1}
                        aria-label={HOME.hero.ctaWhatsApp}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-3.5 rounded-xl border border-chalk/30 text-chalk font-semibold text-[15px] hover:bg-chalk/10 transition-colors"
                      >
                        <MessageCircle className="w-[18px] h-[18px] text-wa" />
                        <span className="hidden sm:inline">{HOME.hero.ctaWhatsApp}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slide progress */}
            <div className="mt-8 flex items-center gap-2 max-w-xs" role="tablist" aria-label="Featured collections">
              {HOME.heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeSlide}
                  aria-label={slide.eyebrow}
                  onClick={() => goToSlide(idx)}
                  className="group flex-1 py-3 cursor-pointer"
                >
                  <span className="block h-1 rounded-full bg-chalk/25 overflow-hidden">
                    {idx === activeSlide && <span key={activeSlide} className="hero-progress block h-full bg-caution" />}
                    {idx < activeSlide && <span className="block h-full bg-chalk/60" />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Image panel with a green duotone so any photo feels on-brand */}
          <div className="lg:col-span-5 relative">
            <Link
              to={HOME.heroSlides[activeSlide].ctaPath}
              aria-label={`${HOME.heroSlides[activeSlide].eyebrow} — ${HOME.heroSlides[activeSlide].ctaLabel}`}
              className="group block relative aspect-[5/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-turf-deep"
            >
              {HOME.heroSlides.map((slide, idx) => (
                <img
                  key={slide.id}
                  src={slide.imageUrl}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover object-center grayscale contrast-110 transition-all duration-700 group-hover:scale-[1.03] ${
                    idx === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-[#7FD6AB] mix-blend-multiply pointer-events-none" />
              <PitchLines
                variant="corner"
                className="absolute left-3 top-3 w-20 h-20 sm:w-28 sm:h-28 text-chalk/70 pointer-events-none"
              />
              <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-chalk text-ink text-sm font-semibold px-3 py-1.5 group-hover:bg-caution transition-colors">
                <span>{HOME.heroSlides[activeSlide].eyebrow}</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Promise strip */}
        <div className="relative border-t border-chalk/15">
          <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3">
            {HOME.hero.trustBadges.map((badge, i) => (
              <li
                key={badge}
                className={`py-3.5 text-[13px] sm:text-sm font-semibold text-chalk/85 ${
                  i > 0 ? 'border-l border-chalk/15 pl-3 sm:pl-6' : ''
                }`}
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Shop by club ─────────────────────────────────────────────────── */}
      {teams.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <h2 className="text-sm font-semibold text-ink shrink-0">{HOME.clubStrip.label}</h2>
            <div className="relative min-w-0 flex-1">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-10">
                {teams.map((t) => {
                  const initials = t
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 3)
                    .toUpperCase();
                  return (
                    <Link
                      key={t}
                      to={`/products?team=${encodeURIComponent(t)}`}
                      className="shrink-0 flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full bg-chalk border border-line hover:border-turf transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-turf text-chalk flex items-center justify-center font-display text-[13px] font-extrabold tracking-wide">
                        {initials}
                      </span>
                      <span className="text-sm font-semibold text-ink whitespace-nowrap">{t}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* ─── Shop by kit ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <SectionHead title={HOME.kitCategories.heading} />

        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4">
          {[bigTile, ...smallTiles].map((cat, idx) => {
            const isBig = idx === 0;
            const isWide = idx === 3;
            return (
              <Link
                key={cat.type}
                to={cat.path}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-turf-deep ${
                  isBig
                    ? 'col-span-2 aspect-[16/10] lg:aspect-auto lg:row-span-2'
                    : isWide
                    ? 'col-span-2 aspect-[16/8] lg:aspect-auto'
                    : 'aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto'
                } min-h-[170px]`}
              >
                <img
                  src={cat.imageUrl}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute left-2.5 bottom-2.5 sm:left-3 sm:bottom-3 right-2.5 sm:right-auto max-w-full bg-chalk rounded-lg pl-3 pr-2 py-2 flex items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wide text-turf leading-none">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-ink-mute mt-1 truncate">{cat.subtitle}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-turf text-chalk flex items-center justify-center shrink-0 group-hover:bg-caution group-hover:text-ink transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Featured ─────────────────────────────────────────────────────── */}
      <section className="mt-12 sm:mt-16 bg-chalk border-y border-line py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead title={HOME.featured.heading} to="/products" linkLabel={HOME.featured.viewAllLabel} />

          {loading ? (
            <ProductGridSkeleton count={4} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5" />
          ) : (
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 sm:gap-5 pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {featuredJerseys.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[62%] sm:w-[31%] lg:w-auto lg:[&:nth-child(n+5)]:hidden">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Browse by type ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <SectionHead title={HOME.trendingTabs.heading} to="/products" linkLabel={HOME.trendingTabs.viewAllLabel} />

        <div
          className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-line mb-6"
          role="tablist"
          aria-label="Kit type"
        >
          {HOME.trendingTabs.tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 px-4 py-3 text-[15px] font-semibold border-b-[3px] -mb-px transition-colors ${
                activeTab === tab.value
                  ? 'border-turf text-turf'
                  : 'border-transparent text-ink-mute hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5" />
        ) : filteredTabProducts.length === 0 ? (
          <div className="py-14 text-center rounded-2xl border border-dashed border-line text-sm text-ink-mute">
            {HOME.trendingTabs.emptyTabLabel}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10">
            {filteredTabProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to={activeTab === 'all' ? '/products' : `/products?type=${activeTab}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-turf text-chalk text-[15px] font-semibold hover:bg-turf-mid transition-colors"
          >
            <span>{HOME.trendingTabs.viewAllLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Why Goat Haven ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-wide text-turf leading-none">
            {HOME.whyUs.heading}
          </h2>
          <p className="text-ink-soft mt-3 leading-relaxed">{HOME.whyUs.body}</p>
        </div>

        <div className="halfway text-turf" />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {BRAND_CONFIG.features.map((feature, idx) => {
            const Icon = FEATURE_ICONS[feature.icon] || ShieldCheck;
            return (
              <li
                key={feature.title}
                className={[
                  'py-7 lg:py-9 border-line',
                  idx > 0 ? 'border-t' : '',
                  idx < 2 ? 'md:border-t-0' : 'md:border-t',
                  idx % 2 === 1 ? 'md:border-l md:pl-8' : 'md:pr-8',
                  'lg:border-t-0 lg:px-8 lg:first:pl-0 lg:last:pr-0',
                  idx > 0 ? 'lg:border-l' : 'lg:border-l-0',
                ].join(' ')}
              >
                <Icon className="w-7 h-7 text-turf" strokeWidth={1.6} />
                <h3 className="font-semibold text-ink mt-4 text-[17px]">{feature.title}</h3>
                <p className="text-sm text-ink-soft mt-1.5 leading-relaxed max-w-xs">{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─── WhatsApp concierge ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="on-dark relative overflow-hidden rounded-2xl sm:rounded-3xl bg-turf text-chalk p-7 sm:p-12">
          <PitchLines className="absolute -right-24 -top-24 sm:-right-10 sm:-top-28 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] text-chalk/[0.1] pointer-events-none" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-wide leading-[0.92]">
              {HOME.whatsappBanner.heading}
            </h2>
            <p className="text-chalk/75 mt-4 leading-relaxed max-w-lg">{HOME.whatsappBanner.body}</p>
            <a
              href={buildWhatsAppInquiryURL()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-4 rounded-xl bg-wa text-ink font-bold text-[15px] hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-5 h-5 fill-ink" />
              <span>{HOME.whatsappBanner.ctaLabel}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
