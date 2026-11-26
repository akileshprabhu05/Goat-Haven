import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shirt, Boxes, AlertTriangle, XCircle,
  ArrowUpRight, Plus, RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { inventoryService } from '../services/inventoryService';
import { formatPrice } from '../utils/formatPrice';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { StockAdjustModal } from '../components/admin/StockAdjustModal';
import { useToast } from '../contexts/ToastContext';
import { ADMIN_DASHBOARD, ADMIN_INVENTORY } from '../config/content';

// Map icon name strings to Lucide components
const KPI_ICONS = { Shirt, Boxes, AlertTriangle, XCircle };

// KPI card colour overrides keyed by card key
const KPI_COLORS = {
  totalProducts: 'text-brand-glow',
  totalStock:    'text-blue-400',
  lowStock:      'text-amber-400',
  outOfStock:    'text-rose-500',
};
const KPI_VALUE_COLORS = {
  totalProducts: 'text-white',
  totalStock:    'text-white',
  lowStock:      'text-amber-400',
  outOfStock:    'text-rose-500',
};

export function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjustingVariant, setAdjustingVariant] = useState(null);
  const { showToast } = useToast();

  const loadStats = async () => {
    try {
      const data = await inventoryService.getInventoryOverview(ADMIN_DASHBOARD.lowStockThreshold);
      setOverview(data);
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
      showToast('Failed to load inventory stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const handleStockAdjustSuccess = () => {
    showToast('Inventory updated successfully', 'success');
    setAdjustingVariant(null);
    loadStats();
  };

  // Resolve the display value for each KPI card from the overview object
  const kpiValue = (card) => {
    if (card.valueKey === 'activeProducts') return overview?.activeProducts ?? 0;
    return overview?.[card.valueKey] ?? 0;
  };
  const kpiSub = (card) => {
    if (card.subKey) return `(${overview?.[card.subKey] ?? 0} ${card.subSuffix})`;
    return card.subSuffix;
  };

  return (
    <AdminLayout
      title={ADMIN_DASHBOARD.pageTitle}
      subtitle={ADMIN_DASHBOARD.pageSubtitle}
      action={
        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={ADMIN_DASHBOARD.refreshTitle}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/products?new=1"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accentHover text-white text-sm font-semibold transition-colors "
          >
            <Plus className="w-4 h-4" />
            <span>{ADMIN_DASHBOARD.addJerseyLabel}</span>
          </Link>
        </div>
      }
    >
      {loading ? (
        <Spinner size="lg" className="py-24" />
      ) : (
        <div className="space-y-8">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADMIN_DASHBOARD.kpiCards.map((card) => {
              const Icon = KPI_ICONS[card.icon];
              return (
                <div key={card.key} className="p-5 sm:p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-300">
                      {card.label}
                    </span>
                    {Icon && <Icon className={`w-5 h-5 ${KPI_COLORS[card.key] || 'text-zinc-400'}`} />}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2.5">
                    <span className={`text-6xl font-display font-black leading-none ${KPI_VALUE_COLORS[card.key] || 'text-white'}`}>
                      {kpiValue(card)}
                    </span>
                    <span className="text-sm text-zinc-400">{kpiSub(card)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Low Stock Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-extrabold font-display uppercase tracking-wide text-white leading-none">
                  {ADMIN_DASHBOARD.restockSection.heading}
                </h2>
                <p className="text-xs text-zinc-400">{ADMIN_DASHBOARD.restockSection.subtitle}</p>
              </div>
              <Link
                to="/admin/inventory"
                className="text-xs font-bold text-brand-glow hover:underline flex items-center gap-1"
              >
                <span>{ADMIN_DASHBOARD.restockSection.viewAllLabel}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {overview?.allVariants?.filter(v => v.stock_quantity <= ADMIN_DASHBOARD.lowStockThreshold).length === 0 ? (
              <p className="text-xs text-emerald-400 py-4 font-semibold">
                {ADMIN_DASHBOARD.restockSection.allStockedMessage}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.product}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.size}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.sku}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.stock}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.status}</th>
                      <th className="py-3 px-4 text-right">{ADMIN_INVENTORY.matrix.columns.action}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {overview?.allVariants
                      ?.filter(v => v.stock_quantity <= ADMIN_DASHBOARD.lowStockThreshold)
                      .slice(0, 6)
                      .map((variant) => (
                        <tr key={variant.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">{variant.product_name}</td>
                          <td className="py-3.5 px-4 font-bold text-zinc-200">{variant.size}</td>
                          <td className="py-3.5 px-4 font-mono text-zinc-400">
                            {variant.sku || ADMIN_INVENTORY.matrix.noSkuLabel}
                          </td>
                          <td className="py-3.5 px-4 font-black text-sm">{variant.stock_quantity}</td>
                          <td className="py-3.5 px-4">
                            {variant.stock_quantity === 0 ? (
                              <Badge variant="danger" size="sm">
                                {ADMIN_INVENTORY.statusLabels.outOfStock}
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="sm">
                                {ADMIN_INVENTORY.statusLabels.lowStock}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setAdjustingVariant(variant)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                            >
                              {ADMIN_INVENTORY.matrix.adjustLabel}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recently Updated Products */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-extrabold font-display uppercase tracking-wide text-white leading-none">
                  {ADMIN_DASHBOARD.recentSection.heading}
                </h2>
                <p className="text-xs text-zinc-400">{ADMIN_DASHBOARD.recentSection.subtitle}</p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-brand-glow hover:underline flex items-center gap-1"
              >
                <span>{ADMIN_DASHBOARD.recentSection.viewAllLabel}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overview?.recentlyUpdated?.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <img
                    src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=200&q=80'}
                    alt={p.name}
                    className="w-16 h-16 rounded-lg object-cover bg-zinc-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{p.name}</h4>
                    <p className="text-xs text-zinc-400">{p.team} • {formatPrice(p.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={p.is_active ? 'success' : 'default'} size="sm">
                        {p.is_active ? ADMIN_INVENTORY.statusLabels.inStock : 'Draft'}
                      </Badge>
                      {p.is_featured && <Badge variant="accent" size="sm">Featured</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adjustingVariant && (
        <StockAdjustModal
          isOpen={Boolean(adjustingVariant)}
          variant={adjustingVariant}
          onClose={() => setAdjustingVariant(null)}
          onSuccess={handleStockAdjustSuccess}
        />
      )}
    </AdminLayout>
  );
}
