import { useEffect, useState } from 'react';
import {
  categoriesForTier,
  defaultImageForCategory,
  defaultSpecsForCategory,
} from '../api/client';
import DynamicSpecFields from './DynamicSpecFields';
import { ProductThumbnail } from './TechSpecsTooltip';

const EMPTY = {
  commercialSku: '',
  name: '',
  tier: 'ACTUATOR',
  category: 'ACT_SWITCH',
  imageUrl: '',
  technicalSpecs: {},
  region: 'GLOBAL',
  protocol: 'ZIGBEE_3',
  lifecycle: 'RND',
  segment: 'MID_ECOSYSTEM',
  mechanicalMount: 'SQUARE_UK_VN',
  electricalNeutral: 'WITH_NEUTRAL',
  whiteLabelBrand: 'SmartHome OEM',
  softwareFeature: 'FREE',
  activationRate: 80,
  offlineRate: 3,
  hardwareVersion: 'v1.0',
  firmwareId: '',
  pcbaId: '',
  description: '',
  tierAttributes: { channels: 1 },
};

function tierDefaults(tier) {
  switch (tier) {
    case 'HUB':
      return { maxDeviceLoad: 128, ramMb: 256, cpuMhz: 1200 };
    case 'ACTUATOR':
      return { channels: 1 };
    case 'SENSOR':
      return { batteryType: 'CR2032', powerConsumptionLevel: 'LOW', sensorTypes: ['motion'] };
    case 'STANDALONE':
      return { connectivity: ['WIFI'], hasAi: false };
    default:
      return {};
  }
}

function firstCategoryForTier(meta, tier) {
  const cats = categoriesForTier(meta, tier);
  return cats[0]?.value || 'ACT_SWITCH';
}

export default function ProductFormModal({ meta, product, onClose, onSave, saving }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(EMPTY);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        ...EMPTY,
        ...product,
        pcbaId: product.pcbaId || '',
        technicalSpecs: product.technicalSpecs || {},
        imageUrl: product.imageUrl || '',
        tierAttributes: product.tierAttributes || tierDefaults(product.tier),
      });
    } else if (meta) {
      const tier = 'ACTUATOR';
      const cat = firstCategoryForTier(meta, tier);
      setForm({
        ...EMPTY,
        tier,
        category: cat,
        imageUrl: defaultImageForCategory(meta, cat),
        technicalSpecs: defaultSpecsForCategory(meta, cat),
      });
    }
  }, [product, meta]);

  function set(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'tier') {
        const cat = firstCategoryForTier(meta, value);
        next.category = cat;
        next.tierAttributes = tierDefaults(value);
        next.technicalSpecs = defaultSpecsForCategory(meta, cat);
        next.imageUrl = defaultImageForCategory(meta, cat);
        if (value === 'HUB') next.segment = 'PREMIUM_FLAGSHIP';
        if (value === 'STANDALONE') next.segment = 'BASIC';
      }
      return next;
    });
  }

  function onCategoryChange(category) {
    setForm((f) => ({
      ...f,
      category,
      technicalSpecs: defaultSpecsForCategory(meta, category),
      imageUrl: f.imageUrl?.trim() ? f.imageUrl : defaultImageForCategory(meta, category),
    }));
  }

  function useDefaultImage() {
    set('imageUrl', defaultImageForCategory(meta, form.category));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const payload = {
        ...form,
        activationRate: Number(form.activationRate),
        offlineRate: Number(form.offlineRate),
        pcbaId: form.pcbaId || null,
        imageUrl: form.imageUrl?.trim() || undefined,
        technicalSpecs: form.technicalSpecs,
      };
      await onSave(payload, isEdit ? product.id : null);
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Lưu thất bại');
    }
  }

  const sel =
    'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';
  const lbl = 'block text-xs text-slate-500 mb-1';
  const tierCategories = categoriesForTier(meta, form.tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4 z-10">
          <h3 className="font-semibold">{isEdit ? 'Sửa SKU' : 'Thêm SKU Mới'}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {err && (
            <p className="rounded-lg border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300">
              {err}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>Mã SKU *</label>
              <input
                required
                value={form.commercialSku}
                onChange={(e) => set('commercialSku', e.target.value)}
                className={`${sel} font-mono`}
              />
            </div>
            <div>
              <label className={lbl}>Tên sản phẩm *</label>
              <input
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={sel}
              />
            </div>
          </div>

          <div className="rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3">
            <p className="text-xs font-semibold text-cyan-400 mb-2">Phân loại danh mục</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>Tầng sản phẩm</label>
                <select value={form.tier} onChange={(e) => set('tier', e.target.value)} className={sel}>
                  {meta?.tiers?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Danh mục chi tiết *</label>
                <select
                  value={form.category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className={sel}
                >
                  {tierCategories.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 p-3">
            <p className="text-xs font-semibold text-slate-400 mb-2">Hình ảnh sản phẩm</p>
            <div className="flex flex-wrap gap-3 items-start">
              <ProductThumbnail imageUrl={form.imageUrl} name={form.name} size={72} />
              <div className="flex-1 min-w-[200px]">
                <label className={lbl}>Đường dẫn ảnh (Image URL)</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => set('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className={`${sel} font-mono text-xs`}
                />
                <button
                  type="button"
                  onClick={useDefaultImage}
                  className="mt-1 text-xs text-brand-400 hover:underline"
                >
                  Dùng ảnh mặc định theo danh mục
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              Thông số kỹ thuật (theo danh mục)
            </p>
            <DynamicSpecFields
              meta={meta}
              category={form.category}
              specs={form.technicalSpecs || {}}
              onChange={(technicalSpecs) => setForm((f) => ({ ...f, technicalSpecs }))}
            />
          </div>

          <div className="rounded-lg border border-slate-800 p-3">
            <p className="text-xs font-semibold text-brand-400 mb-2">Chiều ngang — Phân khúc</p>
            <select value={form.segment} onChange={(e) => set('segment', e.target.value)} className={sel}>
              {meta?.segments?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-slate-800 p-3">
            <p className="text-xs font-semibold text-teal-400 mb-2">Chiều dọc — Localization</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>Hạ tầng cơ khí (Đế âm)</label>
                <select
                  value={form.mechanicalMount}
                  onChange={(e) => set('mechanicalMount', e.target.value)}
                  className={sel}
                >
                  {meta?.mechanicalMounts?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Hạ tầng điện (Dây nguội)</label>
                <select
                  value={form.electricalNeutral}
                  onChange={(e) => set('electricalNeutral', e.target.value)}
                  className={sel}
                  disabled={form.tier !== 'ACTUATOR'}
                >
                  {meta?.electricalNeutral?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 p-3">
            <p className="text-xs font-semibold text-violet-400 mb-2">Chiều sâu — Software</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>White-Label Brand</label>
                <input
                  value={form.whiteLabelBrand}
                  onChange={(e) => set('whiteLabelBrand', e.target.value)}
                  className={sel}
                />
              </div>
              <div>
                <label className={lbl}>Tính năng phần mềm</label>
                <select
                  value={form.softwareFeature}
                  onChange={(e) => set('softwareFeature', e.target.value)}
                  className={sel}
                >
                  {meta?.softwareFeatures?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className={lbl}>Vùng</label>
              <select value={form.region} onChange={(e) => set('region', e.target.value)} className={sel}>
                {meta?.regions?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Giao thức</label>
              <select
                value={form.protocol}
                onChange={(e) => set('protocol', e.target.value)}
                className={sel}
              >
                {meta?.protocols?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Vòng đời</label>
              <select
                value={form.lifecycle}
                onChange={(e) => set('lifecycle', e.target.value)}
                className={sel}
              >
                {meta?.lifecycles?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className={lbl}>HW Rev</label>
              <input
                value={form.hardwareVersion}
                onChange={(e) => set('hardwareVersion', e.target.value)}
                className={sel}
              />
            </div>
            <div>
              <label className={lbl}>Firmware ID</label>
              <input
                value={form.firmwareId}
                onChange={(e) => set('firmwareId', e.target.value)}
                className={`${sel} font-mono text-xs`}
              />
            </div>
            <div>
              <label className={lbl}>Activation %</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={form.activationRate}
                onChange={(e) => set('activationRate', e.target.value)}
                className={sel}
              />
            </div>
            <div>
              <label className={lbl}>Offline %</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={form.offlineRate}
                onChange={(e) => set('offlineRate', e.target.value)}
                className={sel}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
