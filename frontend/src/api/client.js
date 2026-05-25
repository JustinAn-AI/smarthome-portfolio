const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  getMeta: () => request('/meta'),
  getSummary: () => request('/dashboard/summary'),
  getProducts: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    return request(`/products${q ? `?${q}` : ''}`);
  },
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deprecateProduct: (id) => request(`/products/${id}/deprecate`, { method: 'POST' }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  checkSerial: (serialNumber, market = 'GLOBAL') =>
    request(`/serials/check?serialNumber=${encodeURIComponent(serialNumber)}&market=${market}`),
};

const COLOR_MAP = {
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  red: 'bg-red-500/20 text-red-300 border-red-500/40',
};

export function lifecycleClass(meta, lifecycle) {
  const key = meta?.lifecycleColors?.[lifecycle] || 'slate';
  return COLOR_MAP[key] || 'bg-slate-500/20 text-slate-300 border-slate-500/40';
}

export function labelFor(meta, group, value) {
  return meta?.labels?.[group]?.[value] ?? value;
}

export function formatSpecsSummary(meta, product) {
  const specs = product.salesSpecs || {};
  const fields =
    product.systemRole === 'HUB_CENTRAL'
      ? meta?.hubSalesSpecFields || []
      : meta?.salesSpecFields?.[product.productCategory] || [];

  return fields
    .map((f) => {
      const v = specs[f.key];
      if (v === undefined || v === null || v === '') return null;
      let text = v;
      if (f.type === 'boolean') text = v ? 'Có' : 'Không';
      if (f.type === 'select') {
        const opt = (f.options || []).find((o) => o.value === v);
        text = opt?.label ?? v;
      }
      return `${f.label}: ${text}${f.unit && f.type === 'number' ? f.unit : ''}`;
    })
    .filter(Boolean);
}
