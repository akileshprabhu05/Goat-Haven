import React, { useState, useEffect } from 'react';
import {
  Boxes, Search, RefreshCw,
  History, ArrowDownRight, ArrowUpRight,
} from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { inventoryService } from '../services/inventoryService';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { StockAdjustModal } from '../components/admin/StockAdjustModal';
import { useToast } from '../contexts/ToastContext';
import { ADMIN_INVENTORY } from '../config/content';

export function AdminInventory() {
  const [activeTab, setActiveTab]           = useState('matrix');
  const [overview, setOverview]             = useState(null);
  const [history, setHistory]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [adjustingVariant, setAdjustingVariant] = useState(null);
  const { showToast } = useToast();

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [overviewData, historyData] = await Promise.all([
        inventoryService.getInventoryOverview(5),
        inventoryService.getAdjustmentHistory(),
      ]);
      setOverview(overviewData);
      setHistory(historyData);
    } catch (err) {
      console.error(err);
      showToast('Error loading inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInventory(); }, []);

  const handleStockAdjustSuccess = () => {
    showToast('Inventory updated safely and logged in history', 'success');
    setAdjustingVariant(null);
    loadInventory();
  };

  const filteredVariants = (overview?.allVariants || []).filter(v =>
    v.product_name.toLowerCase().includes(search.toLowerCase()) ||
    v.sku?.toLowerCase().includes(search.toLowerCase()) ||
    v.size.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title={ADMIN_INVENTORY.pageTitle}
      subtitle={ADMIN_INVENTORY.pageSubtitle}
      action={
        <div className="flex items-center gap-3">
          <button
            onClick={loadInventory}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={ADMIN_INVENTORY.refreshTitle}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Boxes className="w-4 h-4 text-brand-glow" />
            <span>{ADMIN_INVENTORY.tabs.matrix}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <History className="w-4 h-4 text-blue-400" />
            <span>{ADMIN_INVENTORY.tabs.history} ({history.length})</span>
          </button>
        </div>

        {/* Tab 1: Size Stock Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={ADMIN_INVENTORY.matrix.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>
              <div className="text-xs font-semibold text-zinc-400">
                {ADMIN_INVENTORY.matrix.showingLabel}{' '}
                <strong className="text-white">{filteredVariants.length}</strong>{' '}
                {ADMIN_INVENTORY.matrix.showingUnitsSuffix}
              </div>
            </div>

            {loading ? (
              <Spinner size="lg" className="py-24" />
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.product}</th>
                        <th className="py-3 px-4 text-center">{ADMIN_INVENTORY.matrix.columns.size}</th>
                        <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.sku}</th>
                        <th className="py-3 px-4 text-center">{ADMIN_INVENTORY.matrix.columns.stock}</th>
                        <th className="py-3 px-4">{ADMIN_INVENTORY.matrix.columns.status}</th>
                        <th className="py-3 px-4 text-right">{ADMIN_INVENTORY.matrix.columns.action}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredVariants.map((variant) => {
                        const isOut = variant.stock_quantity === 0;
                        const isLow = variant.stock_quantity > 0 && variant.stock_quantity <= 5;

                        return (
                          <tr key={variant.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {variant.product_image && (
                                  <img
                                    src={variant.product_image}
                                    alt={variant.product_name}
                                    className="w-9 h-9 rounded-lg object-cover bg-zinc-950"
                                  />
                                )}
                                <div>
                                  <h4 className="font-bold text-white text-xs">{variant.product_name}</h4>
                                  <span className="text-[10px] text-zinc-400">{variant.product_team}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center font-black text-sm text-zinc-100">
                              {variant.size}
                            </td>

                            <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                              {variant.sku || ADMIN_INVENTORY.matrix.noSkuLabel}
                            </td>

                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-lg font-black text-sm ${
                                isOut
                                  ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                                  : isLow
                                  ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                  : 'bg-zinc-950 text-white border border-zinc-800'
                              }`}>
                                {variant.stock_quantity}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {isOut ? (
                                <Badge variant="danger" size="sm">{ADMIN_INVENTORY.statusLabels.outOfStock}</Badge>
                              ) : isLow ? (
                                <Badge variant="warning" size="sm">{ADMIN_INVENTORY.statusLabels.lowStock}</Badge>
                              ) : (
                                <Badge variant="success" size="sm">{ADMIN_INVENTORY.statusLabels.inStock}</Badge>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setAdjustingVariant(variant)}
                                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
                              >
                                {ADMIN_INVENTORY.matrix.adjustLabel}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Adjustment History */}
        {activeTab === 'history' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">
                {ADMIN_INVENTORY.history.heading}
              </h3>
              <p className="text-xs text-zinc-400">{ADMIN_INVENTORY.history.subtitle}</p>
            </div>

            {loading ? (
              <Spinner size="lg" className="py-24" />
            ) : history.length === 0 ? (
              <p className="p-8 text-center text-xs text-zinc-500">
                {ADMIN_INVENTORY.history.noHistoryText}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.history.columns.date}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.history.columns.product}</th>
                      <th className="py-3 px-4 text-center">{ADMIN_INVENTORY.history.columns.prev}</th>
                      <th className="py-3 px-4 text-center">{ADMIN_INVENTORY.history.columns.change}</th>
                      <th className="py-3 px-4 text-center">{ADMIN_INVENTORY.history.columns.new}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.history.columns.reason}</th>
                      <th className="py-3 px-4">{ADMIN_INVENTORY.history.columns.admin}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {history.map((record) => {
                      const isPositive = record.change_quantity > 0;
                      return (
                        <tr key={record.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                            {new Date(record.created_at).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {record.product_name} <span className="text-brand-glow">({record.size})</span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-zinc-400 font-mono">
                            {record.previous_quantity}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {isPositive ? `+${record.change_quantity}` : record.change_quantity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-black text-white">
                            {record.new_quantity}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300 max-w-xs truncate" title={record.reason}>
                            {record.reason}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                            {record.admin_email || ADMIN_INVENTORY.history.fallbackAdmin}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

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
