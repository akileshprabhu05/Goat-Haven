import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { inventoryService } from '../../services/inventoryService';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Plus, Minus } from 'lucide-react';
import { UI, ADMIN_SIDEBAR } from '../../config/content';

const S = UI.stockAdjust;

export function StockAdjustModal({ isOpen, variant, onClose, onSuccess }) {
  const { user } = useAuth();

  const [mode, setMode]     = useState('add');
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  if (!variant) return null;

  const currentStock = variant.stock_quantity || 0;
  const numAmount    = parseInt(amount, 10) || 0;

  let projectedStock = currentStock;
  if (mode === 'add')      projectedStock = currentStock + numAmount;
  else if (mode === 'subtract') projectedStock = Math.max(0, currentStock - numAmount);
  else if (mode === 'set')      projectedStock = Math.max(0, numAmount);

  const handleAdjust = async (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError(S.reasonRequired);
      return;
    }

    let delta = 0;
    if (mode === 'add')      delta = numAmount;
    else if (mode === 'subtract') delta = -numAmount;
    else if (mode === 'set')      delta = numAmount - currentStock;

    if (delta === 0) {
      setError(S.noChangeError);
      return;
    }

    setLoading(true);
    try {
      await inventoryService.adjustStock({
        variantId:  variant.id,
        delta,
        reason:     reason.trim(),
        adminId:    user?.id,
        adminEmail: user?.email || ADMIN_SIDEBAR.fallbackEmail,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={S.modalTitle}>
      <form onSubmit={handleAdjust} className="space-y-4">

        {/* Variant Info Banner */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <p className="text-sm text-zinc-400 font-semibold">{S.variantLabel}</p>
          <h4 className="font-bold text-white text-base mt-0.5">{variant.product_name}</h4>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="font-bold text-brand-glow">Size: {variant.size}</span>
            <span className="text-zinc-500 font-mono">SKU: {variant.sku || 'N/A'}</span>
            <span className="ml-auto text-zinc-300">
              {S.currentStockLabel} <strong className="text-white text-sm">{currentStock}</strong>
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'add'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{S.addLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('subtract')}
            className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'subtract'
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-400'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
            <span>{S.subtractLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('set')}
            className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-colors ${
              mode === 'set'
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-400'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {S.setLabel}
          </button>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">
            {mode === 'add' ? S.addQtyLabel : mode === 'subtract' ? S.subtractQtyLabel : S.setQtyLabel}
          </label>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* Projected Stock Preview */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/60 text-xs">
          <span className="text-zinc-400">{S.projectedLabel}</span>
          <span className="font-bold text-white text-sm">
            {currentStock} → <span className="text-brand-glow">{projectedStock} units</span>
          </span>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">
            {S.reasonLabel} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder={S.reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {S.cancelLabel}
          </Button>
          <Button type="submit" loading={loading} variant="primary">
            {S.confirmLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
