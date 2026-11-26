import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, Grid3x3, X } from 'lucide-react';
import { CATALOGUE, SEO } from '../config/content';
import { productService } from '../services/productService';
import { ProductCard, ProductGridSkeleton } from '../components/products/ProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/common/SEOHead';
import { PitchLines } from '../components/common/PitchLines';

const selectClass =
  'w-full bg-chalk border border-line rounded-lg px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-turf';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get('team') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [mobileCols, setMobileCols] = useState(2);

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setSelectedTeam(searchParams.get('team') || 'all');
    setSelectedType(searchParams.get('type') || 'all');
  }, [searchParams]);

  useEffect(() => {
    productService.getTeams().then(setTeams).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      productService
        .getProducts({ search, team: selectedTeam, jerseyType: selectedType, sortBy, inStockOnly })
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 150);
    return () => clearTimeout(timer);
  }, [search, selectedTeam, selectedType, sortBy, inStockOnly]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedTeam('all');
    setSelectedType('all');
    setSortBy('newest');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilter = search || selectedTeam !== 'all' || selectedType !== 'all' || inStockOnly;
  const activeCount = [search, selectedTeam !== 'all', inStockOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <SEOHead title={SEO.catalogue.title} description={SEO.catalogue.description} />
      <Navbar />

      {/* Page header */}
      <header className="on-dark relative overflow-hidden bg-turf text-chalk">
        <PitchLines className="absolute -right-24 -top-36 w-[420px] h-[420px] text-chalk/[0.08] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="font-display text-6xl sm:text-8xl font-extrabold uppercase tracking-tight leading-[0.86]">
            {CATALOGUE.pageTitle}
          </h1>
          <p className="text-chalk/75 mt-3 max-w-xl text-[15px] leading-relaxed">{CATALOGUE.pageSubtitle}</p>
        </div>
      </header>

      {/* Sticky filter bar */}
      <div className="sticky top-14 md:top-16 z-30 bg-paper/95 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder={CATALOGUE.filters.searchPlaceholder}
                aria-label="Search jerseys"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-chalk border border-line rounded-lg pl-10 pr-3 py-2.5 text-sm text-ink placeholder-ink-mute focus:outline-none focus:border-turf"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                showFilters
                  ? 'bg-turf border-turf text-chalk'
                  : 'bg-chalk border-line text-ink hover:border-turf'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{CATALOGUE.filters.filtersButton}</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-caution text-ink text-[11px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="flex sm:hidden items-center bg-chalk border border-line rounded-lg p-0.5 shrink-0">
              {[2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMobileCols(n)}
                  aria-label={`${n} columns`}
                  aria-pressed={mobileCols === n}
                  className={`p-2 rounded-md transition-colors ${
                    mobileCols === n ? 'bg-turf text-chalk' : 'text-ink-mute'
                  }`}
                >
                  {n === 2 ? <LayoutGrid className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Kit-type chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATALOGUE.jerseyTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                aria-pressed={selectedType === type.value}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  selectedType === type.value
                    ? 'bg-turf text-chalk'
                    : 'bg-chalk border border-line text-ink-soft hover:border-turf hover:text-turf'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="pt-3 border-t border-line grid grid-cols-1 sm:grid-cols-3 gap-3 items-center animate-slide-in">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                aria-label="Club"
                className={selectClass}
              >
                <option value="all">{CATALOGUE.filters.teamPlaceholder}</option>
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort order"
                className={selectClass}
              >
                {CATALOGUE.sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-ink cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>{CATALOGUE.filters.inStockLabel}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 rounded-md text-ink-mute hover:text-ink"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-5" aria-live="polite">
          <p className="text-sm text-ink-soft">
            {CATALOGUE.results.showing}{' '}
            <span className="font-bold text-ink">{products.length}</span>{' '}
            {products.length === 1 ? CATALOGUE.results.singularUnit : CATALOGUE.results.pluralUnit}
          </p>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-semibold text-turf underline underline-offset-4 hover:text-turf-mid"
            >
              {CATALOGUE.filters.resetLabel}
            </button>
          )}
        </div>

        {loading ? (
          <ProductGridSkeleton
            count={8}
            compact={mobileCols === 3}
            className={`grid sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 ${
              mobileCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
            }`}
          />
        ) : products.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-line px-6">
            <h2 className="font-display text-4xl font-black uppercase tracking-wide text-turf">
              {CATALOGUE.empty.heading}
            </h2>
            <p className="text-ink-soft text-sm mt-2 max-w-sm mx-auto">{CATALOGUE.empty.body}</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-6 py-3 rounded-xl bg-turf hover:bg-turf-mid text-chalk font-semibold text-sm transition-colors"
            >
              {CATALOGUE.empty.resetLabel}
            </button>
          </div>
        ) : (
          <div
            className={`grid sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 ${
              mobileCols === 3 ? 'grid-cols-3 gap-x-2' : 'grid-cols-2'
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} compact={mobileCols === 3} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
