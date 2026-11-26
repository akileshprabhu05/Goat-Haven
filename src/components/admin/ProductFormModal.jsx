import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { productService } from '../../services/productService';
import { slugify } from '../../utils/slugify';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Trash2, Upload, Loader2, Link2, Star, X } from 'lucide-react';
import { PRODUCT_FORM } from '../../config/content';

export function ProductFormModal({ isOpen, product, onClose, onSuccess }) {
  const isEditing = Boolean(product?.id);
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name:        product?.name        || '',
    slug:        product?.slug        || '',
    description: product?.description || '',
    team:        product?.team        || '',
    season:      product?.season      || PRODUCT_FORM.defaultSeason,
    jersey_type: product?.jersey_type || 'Home',
    price:       product?.price       || '',
    sku:         product?.sku         || '',
    is_active:   product?.is_active   ?? true,
    is_featured: product?.is_featured ?? false,
  });

  const [variants, setVariants] = useState(
    product?.variants?.length ? product.variants : PRODUCT_FORM.defaultVariants.map(v => ({ ...v }))
  );

  const [images, setImages] = useState(
    product?.images?.length ? product.images.map(img => img.image_url || img).filter(Boolean) : []
  );

  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging]           = useState(false);
  const [showUrlInput, setShowUrlInput]       = useState(false);
  const [urlInput, setUrlInput]               = useState('');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slugify(name),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddVariant = () =>
    setVariants(prev => [...prev, { ...PRODUCT_FORM.newVariantDefault }]);

  const handleRemoveVariant = (index) =>
    setVariants(prev => prev.filter((_, i) => i !== index));

  const handleFilesSelected = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setError('');
    setUploadingImages(true);
    try {
      const productKey = formData.slug || formData.name || 'jersey';
      const results = await Promise.allSettled(
        files.map((file) => productService.uploadProductImage(file, productKey))
      );

      const uploadedUrls = [];
      const failedReasons = [];

      results.forEach((res) => {
        if (res.status === 'fulfilled' && res.value) {
          uploadedUrls.push(res.value);
        } else if (res.status === 'rejected') {
          failedReasons.push(res.reason?.message || PRODUCT_FORM.validation.operationFailed);
        }
      });

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
      }
      if (failedReasons.length > 0) {
        setError(failedReasons[0]);
      }
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const handleRemoveImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.team || !formData.price) {
      setError(PRODUCT_FORM.validation.requiredFields);
      return;
    }

    setLoading(true);
    try {
      const filteredImages = images.filter(url => Boolean(url?.trim()));

      if (isEditing) {
        await productService.updateProduct(product.id, { product: formData, variants, images: filteredImages });
        showToast(PRODUCT_FORM.toasts.updated, 'success');
      } else {
        await productService.createProduct({ product: formData, variants, images: filteredImages });
        showToast(PRODUCT_FORM.toasts.created, 'success');
      }
      onSuccess();
    } catch (err) {
      setError(err.message || PRODUCT_FORM.validation.operationFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? PRODUCT_FORM.editTitle : PRODUCT_FORM.addTitle}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Basic Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 pb-1 border-b border-zinc-800">
            {PRODUCT_FORM.labels.basicInfoHeading}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
                {PRODUCT_FORM.labels.name} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={PRODUCT_FORM.placeholders.name}
                value={formData.name}
                onChange={handleNameChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
                {PRODUCT_FORM.labels.slug}
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-brand-accent font-mono"
              />
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
                {PRODUCT_FORM.labels.team} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={PRODUCT_FORM.placeholders.team}
                value={formData.team}
                onChange={(e) => setFormData(p => ({ ...p, team: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
              />
            </div>

            {/* Season */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
                {PRODUCT_FORM.labels.season}
              </label>
              <input
                type="text"
                placeholder={PRODUCT_FORM.placeholders.season}
                value={formData.season}
                onChange={(e) => setFormData(p => ({ ...p, season: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
              />
            </div>

            {/* Jersey Type */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
                {PRODUCT_FORM.labels.jerseyType}
              </label>
              <select
                value={formData.jersey_type}
                onChange={(e) => setFormData(p => ({ ...p, jersey_type: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
              >
                {PRODUCT_FORM.jerseyTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
                {PRODUCT_FORM.labels.price} <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder={PRODUCT_FORM.placeholders.price}
                value={formData.price}
                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-zinc-200 mb-1.5">
              {PRODUCT_FORM.labels.description}
            </label>
            <textarea
              rows="3"
              placeholder={PRODUCT_FORM.placeholders.description}
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        {/* Sizes & Stock */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-400">
              {PRODUCT_FORM.labels.sizesHeading}
            </h4>
            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-glow hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> {PRODUCT_FORM.labels.addSizeLabel}
            </button>
          </div>

          <div className="space-y-2">
            {variants.map((v, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-zinc-950/60 p-2 rounded-xl border border-zinc-800">
                <input
                  type="text"
                  placeholder={PRODUCT_FORM.placeholders.sizeInput}
                  value={v.size}
                  onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                  className="w-20 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-white uppercase"
                />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] text-zinc-400">{PRODUCT_FORM.labels.stockUnitsLabel}</span>
                  <input
                    type="number"
                    min="0"
                    value={v.stock_quantity}
                    onChange={(e) => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value, 10) || 0)}
                    className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg"
                  title="Remove size"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-zinc-400">
              {PRODUCT_FORM.labels.imagesHeading}
            </h4>
            <button
              type="button"
              onClick={() => setShowUrlInput((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-brand-glow"
            >
              <Link2 className="w-3.5 h-3.5" /> {PRODUCT_FORM.labels.addImageLabel}
            </button>
          </div>

          {/* Upload dropzone */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
          <button
            type="button"
            disabled={uploadingImages}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFilesSelected(e.dataTransfer.files);
            }}
            className={`w-full rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
              isDragging
                ? 'border-brand-glow bg-brand-accent/15'
                : 'border-zinc-700 bg-zinc-950/60 hover:border-brand-accent hover:bg-zinc-950'
            } ${uploadingImages ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
          >
            <div className="flex flex-col items-center gap-1.5">
              {uploadingImages ? (
                <Loader2 className="w-6 h-6 text-brand-glow animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-brand-glow" />
              )}
              <span className="text-xs font-semibold text-zinc-200">
                {uploadingImages ? PRODUCT_FORM.labels.uploadingLabel : PRODUCT_FORM.labels.uploadDropTitle}
              </span>
              <span className="text-[11px] text-zinc-500">
                {PRODUCT_FORM.labels.uploadDropSubtitle}
              </span>
            </div>
          </button>

          {/* Optional paste URL fallback */}
          {showUrlInput && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder={PRODUCT_FORM.placeholders.imageUrl}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddImageUrl}>
                Add
              </Button>
            </div>
          )}

          {/* Uploaded / attached image previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
              {images.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800"
                >
                  <img
                    src={url}
                    alt={`Jersey ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {idx === 0 ? (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-caution text-ink text-[10px] font-bold">
                      {PRODUCT_FORM.labels.primaryImageBadge}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      title={PRODUCT_FORM.labels.setPrimaryLabel}
                      className="absolute top-1.5 left-1.5 p-1 rounded bg-zinc-950/80 text-zinc-300 hover:text-caution opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-zinc-950/85 text-zinc-200 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visibility Toggles */}
        <div className="flex items-center gap-6 pt-3 border-t border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
              className="rounded bg-zinc-950 border-zinc-700 text-brand-glow focus:ring-0 w-4 h-4"
            />
            <span>{PRODUCT_FORM.labels.isActiveLabel}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(p => ({ ...p, is_featured: e.target.checked }))}
              className="rounded bg-zinc-950 border-zinc-700 text-brand-glow focus:ring-0 w-4 h-4"
            />
            <span>{PRODUCT_FORM.labels.isFeaturedLabel}</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="ghost" onClick={onClose} disabled={loading || uploadingImages}>
            {PRODUCT_FORM.buttons.cancel}
          </Button>
          <Button type="submit" loading={loading} disabled={uploadingImages} variant="primary">
            {isEditing ? PRODUCT_FORM.buttons.save : PRODUCT_FORM.buttons.publish}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
