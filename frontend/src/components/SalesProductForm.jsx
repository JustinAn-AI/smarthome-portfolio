import { useEffect, useState } from 'react';
import DynamicSalesSpecs from './DynamicSalesSpecs';
import { ProductThumbnail } from './SpecsTooltip';

const EMPTY = {
  commercialSku: '',
  name: '',
  listPrice: '',
  systemRole: 'PERIPHERAL_HUB',
  productCategory: 'SWITCH',
  imageUrl: '',
  region: 'GLOBAL',
  protocol: 'ZIGBEE_3',
  lifecycle: 'RND',
  salesSpecs: {},
  installationSteps: [],
  installationStepsText: '',
  wiringDiagramUrl: '',
  dimensions: { widthMm: '', heightMm: '', depthMm: '' },
  weightG: '',
  description: '',
};

const FORM_TABS = [
  { id: 'commercial', label: 'Thông tin thương mại' },
  { id: 'specs', label: 'Thông số bán hàng' },
  { id: 'install', label: 'Hướng dẫn lắp đặt' },
];

function defaultSpecs(meta, form) {
  if (form.systemRole === 'HUB_CENTRAL') {
    return { maxChildDevices: 128, powerPort: 'USB Type-C', ethernet: true };
  }
  const cat = form.productCategory;
  if (cat === 'SWITCH' || cat === 'SOCKET') {
    return { maxLoadW: 800, neutralWire: 'WITH_NEUTRAL', mountType: 'SQUARE', channels: 1 };
  }
  if (cat === 'LIGHTING') return { lumens: 800, wattageW: 12, colorMode: 'CCT' };
  if (cat === 'SENSOR') return { batteryType: 'CR2032', detectionRangeM: 7, sensorSubtype: 'Motion' };
  if (cat === 'CURTAIN') return { maxLoadKg: 40, trackLengthM: 3, voltageV: 220 };
  if (cat === 'SECURITY') return { resolution: '2K', connectivity: 'Wi-Fi', nightVision: true };
  return {};
}

function defaultImage(meta, form) {
  if (form.systemRole === 'HUB_CENTRAL') return meta?.defaultImages?.HUB_CENTRAL;
  return meta?.defaultImages?.[form.productCategory];
}

function stepsToText(steps) {
  if (!Array.isArray(steps)) return '';
  return steps.join('\n');
}

function textToSteps(text) {
  return String(text)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s, i) => (s.match(/^Bước\s+\d+/i) ? s : `Bước ${i + 1}: ${s}`));
}

export default function SalesProductForm({ meta, product, onClose, onSave, saving }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(EMPTY);
  const [subTab, setSubTab] = useState('commercial');
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (product) {
      const steps = product.installationSteps || [];
      setForm({
        ...EMPTY,
        ...product,
        salesSpecs: product.salesSpecs || {},
        dimensions: {
          widthMm: product.dimensions?.widthMm ?? '',
          heightMm: product.dimensions?.heightMm ?? '',
          depthMm: product.dimensions?.depthMm ?? '',
        },
        weightG: product.weightG ?? '',
        installationStepsText: stepsToText(steps),
      });
    } else if (meta) {
      setForm({
        ...EMPTY,
        imageUrl: defaultImage(meta, EMPTY) || '',
        salesSpecs: defaultSpecs(meta, EMPTY),
        installationStepsText:
          'Bước 1: Ngắt nguồn điện.\nBước 2: Đấu dây theo sơ đồ.\nBước 3: Gắn thiết bị và bật điện.',
      });
    }
    setSubTab('commercial');
  }, [product, meta]);

  function patch(updates) {
    setForm((f) => ({ ...f, ...updates }));
  }

  function onCategoryChange(productCategory) {
    patch({
      productCategory,
      salesSpecs: defaultSpecs(meta, { ...form, productCategory }),
      imageUrl: form.imageUrl?.trim() ? form.imageUrl : defaultImage(meta, { ...form, productCategory }) || '',
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const payload = {
        commercialSku: form.commercialSku,
        name: form.name,
        listPrice: form.listPrice,
        systemRole: form.systemRole,
        productCategory: form.productCategory,
        region: form.region,
        protocol: form.protocol,
        lifecycle: form.lifecycle,
        imageUrl: form.imageUrl,
        salesSpecs: form.salesSpecs,
        description: form.description,
        installationSteps: textToSteps(form.installationStepsText),
        wiringDiagramUrl: form.wiringDiagramUrl,
        dimensions: {
          widthMm: Number(form.dimensions.widthMm) || 0,
          heightMm: Number(form.dimensions.heightMm) || 0,
          depthMm: Number(form.dimensions.depthMm) || 0,
        },
        weightG: Number(form.weightG) || 0,
        activationRate: Number(form.activationRate) || 80,
        offlineRate: Number(form.offlineRate) || 3,
      };
      await onSave(payload, isEdit ? product.id : null);
      onClose();
    } catch (ex) {
      setErr(ex.message);
    }
  }

  const input =
    'w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 focus:outline-none transition';
  const lbl = 'block text-xs font-medium text-slate-400 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-600 bg-slate-900 shadow-2xl">
        <div className="shrink-0 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl">
              ✕
            </button>
          </div>
          <div className="mt-4 flex gap-1 rounded-xl bg-slate-800 p-1">
            {FORM_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  subTab === t.id
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {err && (
              <p className="rounded-xl border border-red-500/50 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                {err}
              </p>
            )}

            {subTab === 'commercial' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={lbl}>Mã SKU *</label>
                    <input
                      required
                      className={`${input} font-mono`}
                      value={form.commercialSku}
                      onChange={(e) => patch({ commercialSku: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={lbl}>Giá tham khảo (Sales)</label>
                    <input
                      className={input}
                      placeholder="VD: 890.000đ"
                      value={form.listPrice}
                      onChange={(e) => patch({ listPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Tên sản phẩm *</label>
                  <input
                    required
                    className={input}
                    value={form.name}
                    onChange={(e) => patch({ name: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={lbl}>Vai trò hệ thống *</label>
                    <select
                      className={input}
                      value={form.systemRole}
                      onChange={(e) => patch({ systemRole: e.target.value })}
                    >
                      {meta?.systemRoles?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Chủng loại thương mại *</label>
                    <select
                      className={input}
                      value={form.productCategory}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      disabled={form.systemRole === 'HUB_CENTRAL'}
                    >
                      {meta?.productCategories?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Ảnh sản phẩm (URL)</label>
                  <div className="flex gap-3 mt-1">
                    <ProductThumbnail imageUrl={form.imageUrl} name={form.name} size={64} />
                    <input
                      className={`${input} flex-1 font-mono text-xs`}
                      value={form.imageUrl}
                      onChange={(e) => patch({ imageUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={lbl}>Thị trường</label>
                    <select
                      className={input}
                      value={form.region}
                      onChange={(e) => patch({ region: e.target.value })}
                    >
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
                      className={input}
                      value={form.protocol}
                      onChange={(e) => patch({ protocol: e.target.value })}
                    >
                      {meta?.protocols?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Trạng thái bán hàng</label>
                    <select
                      className={input}
                      value={form.lifecycle}
                      onChange={(e) => patch({ lifecycle: e.target.value })}
                    >
                      {meta?.lifecycles?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {subTab === 'specs' && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">
                <p className="text-xs text-amber-200/80 mb-4">
                  Thông số thay đổi theo chủng loại đã chọn:{' '}
                  <strong>
                    {meta?.productCategories?.find((c) => c.value === form.productCategory)?.label}
                  </strong>
                </p>
                <DynamicSalesSpecs
                  meta={meta}
                  systemRole={form.systemRole}
                  productCategory={form.productCategory}
                  specs={form.salesSpecs}
                  onChange={(salesSpecs) => patch({ salesSpecs })}
                />
              </div>
            )}

            {subTab === 'install' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={lbl}>Rộng (mm)</label>
                    <input
                      type="number"
                      className={input}
                      value={form.dimensions.widthMm}
                      onChange={(e) =>
                        patch({
                          dimensions: { ...form.dimensions, widthMm: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={lbl}>Cao (mm)</label>
                    <input
                      type="number"
                      className={input}
                      value={form.dimensions.heightMm}
                      onChange={(e) =>
                        patch({
                          dimensions: { ...form.dimensions, heightMm: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={lbl}>Sâu (mm)</label>
                    <input
                      type="number"
                      className={input}
                      value={form.dimensions.depthMm}
                      onChange={(e) =>
                        patch({
                          dimensions: { ...form.dimensions, depthMm: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Trọng lượng (g)</label>
                  <input
                    type="number"
                    className={input}
                    value={form.weightG}
                    onChange={(e) => patch({ weightG: e.target.value })}
                  />
                </div>
                <div>
                  <label className={lbl}>Các bước lắp đặt (mỗi dòng một bước)</label>
                  <textarea
                    className={`${input} min-h-[140px] font-mono text-xs leading-relaxed`}
                    value={form.installationStepsText}
                    onChange={(e) => patch({ installationStepsText: e.target.value })}
                    placeholder={'Bước 1: Ngắt nguồn...\nBước 2: Đấu dây...'}
                  />
                </div>
                <div>
                  <label className={lbl}>URL sơ đồ đấu dây / kết nối</label>
                  <input
                    className={input}
                    value={form.wiringDiagramUrl}
                    onChange={(e) => patch({ wiringDiagramUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  {form.wiringDiagramUrl && (
                    <img
                      src={form.wiringDiagramUrl}
                      alt="Preview"
                      className="mt-3 max-h-36 rounded-lg border border-slate-600 object-contain"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="shrink-0 flex justify-end gap-3 border-t border-slate-700 bg-slate-900/95 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 hover:bg-brand-500 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
