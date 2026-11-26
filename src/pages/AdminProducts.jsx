import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff,
  Star, ExternalLink, RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { useToast } from '../contexts/ToastContext';
import { ADMIN_PRODUCTS } from '../config/content';

export function AdminProducts() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen]     = useState(searchParams.get('new') === '1');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ adminMode: true });
      setProducts(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleToggleActive = async (product) => {
    try {
      const newStatus = await productService.toggleActive(product.id, product.is_active);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
      showToast(`Jersey set to ${newStatus ? ADMIN_PRODUCTS.status.active : ADMIN_PRODUCTS.status.hidden}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const newFeatured = await productService.toggleFeatured(product.id, product.is_featured);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: newFeatured } : p));
      showToast('Featured status updated', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to toggle featured', 'error');
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    try {
      await productService.deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast('Product removed successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title={ADMIN_PRODUCTS.pageTitle}
      subtitle={ADMIN_PRODUCTS.pageSubtitle}
      action={
        <Button
          onClick={() => { setSelectedProduct(null); setIsFormOpen(true); }}
          icon={Plus}
          size="sm"
        >
          {ADMIN_PRODUCTS.addLabel}
        </Button>
      }
    >
      <div className="space-y-6">

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={ADMIN_PRODUCTS.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent transition-colors"
            />
          </div>

          <button
            onClick={loadProducts}
            className="self-end sm:self-auto p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title={ADMIN_PRODUCTS.refreshTitle}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Product Table */}
        {loading ? (
          <Spinner size="lg" className="py-24" />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <p className="text-zinc-400 text-sm">{ADMIN_PRODUCTS.noResultsText}</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">{ADMIN_PRODUCTS.columns.item}</th>
                    <th className="py-3 px-4">{ADMIN_PRODUCTS.columns.club}</th>
                    <th className="py-3 px-4">{ADMIN_PRODUCTS.columns.type}</th>
                    <th className="py-3 px-4">{ADMIN_PRODUCTS.columns.price}</th>
                    <th className="py-3 px-4">{ADMIN_PRODUCTS.columns.sizes}</th>
                    <th className="py-3 px-4">{ADMIN_PRODUCTS.columns.status}</th>
                    <th className="py-3 px-4 text-center">{ADMIN_PRODUCTS.columns.featured}</th>
                    <th className="py-3 px-4 text-right">{ADMIN_PRODUCTS.columns.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredProducts.map((product) => {
                    const totalUnits = (product.variants || []).reduce(
                      (acc, v) => acc + (v.stock_quantity || 0), 0
                    );

                    return (
                      <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                        {/* Jersey thumbnail + name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=150&q=80'}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-zinc-950 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-sm truncate max-w-xs">{product.name}</h4>
                              <span className="font-mono text-[10px] text-zinc-500 uppercase">
                                {product.sku || 'No SKU'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-zinc-300">{product.team}</td>

                        <td className="py-3.5 px-4">
                          <Badge variant={product.jersey_type === 'Retro' ? 'gold' : 'accent'} size="sm">
                            {product.jersey_type}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 font-black text-white font-sans">
                          {formatPrice(product.price)}
                        </td>

                        {/* Sizes & Stock */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(product.variants || []).map(v => (
                              <span
                                key={v.id || v.size}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  v.stock_quantity > 0
                                    ? 'bg-zinc-800 text-zinc-200'
                                    : 'bg-zinc-950 text-zinc-600 line-through'
                                }`}
                              >
                                {v.size}:{v.stock_quantity}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-1">
                            {ADMIN_PRODUCTS.totalUnitsLabel} {totalUnits} {ADMIN_PRODUCTS.totalUnitsSuffix}
                          </span>
                        </td>

                        {/* Active Status */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className="inline-flex items-center gap-1 cursor-pointer"
                          >
                            {product.is_active ? (
                              <Badge variant="success" size="sm">
                                <Eye className="w-3 h-3" /> {ADMIN_PRODUCTS.status.active}
                              </Badge>
                            ) : (
                              <Badge variant="default" size="sm">
                                <EyeOff className="w-3 h-3" /> {ADMIN_PRODUCTS.status.hidden}
                              </Badge>
                            )}
                          </button>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.is_featured
                                ? 'text-yellow-400 bg-yellow-950/40'
                                : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                            title="Toggle featured showcase"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              title="Preview public listing"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => { setSelectedProduct(product); setIsFormOpen(true); }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {isFormOpen && (
        <ProductFormModal
          isOpen={isFormOpen}
          product={selectedProduct}
          onClose={() => { setIsFormOpen(false); setSelectedProduct(null); }}
          onSuccess={() => { setIsFormOpen(false); setSelectedProduct(null); loadProducts(); }}
        />
      )}
    </AdminLayout>
  );
}
