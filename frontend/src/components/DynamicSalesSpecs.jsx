export default function DynamicSalesSpecs({ meta, systemRole, productCategory, specs, onChange }) {
  const fields =
    systemRole === 'HUB_CENTRAL'
      ? meta?.hubSalesSpecFields || []
      : meta?.salesSpecFields?.[productCategory] || [];

  const sel =
    'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';
  const lbl = 'block text-xs text-slate-500 mb-1';

  if (!fields.length) {
    return <p className="text-xs text-slate-500">Chọn chủng loại để nhập thông số bán hàng.</p>;
  }

  function update(key, value) {
    onChange({ ...specs, [key]: value });
  }

  const hideElectrical =
    productCategory === 'SENSOR' ||
    productCategory === 'SECURITY' ||
    productCategory === 'LIGHTING' ||
    productCategory === 'CURTAIN';

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => {
        if (
          hideElectrical &&
          systemRole !== 'HUB_CENTRAL' &&
          (field.key === 'neutralWire' || field.key === 'mountType')
        ) {
          return null;
        }
        return (
          <div key={field.key}>
            <label className={lbl}>
              {field.label}
              {field.unit ? ` (${field.unit})` : ''}
            </label>
            {field.type === 'select' ? (
              <select
                className={sel}
                value={specs[field.key] ?? ''}
                onChange={(e) => update(field.key, e.target.value)}
              >
                {(field.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'boolean' ? (
              <select
                className={sel}
                value={specs[field.key] === true ? 'true' : 'false'}
                onChange={(e) => update(field.key, e.target.value === 'true')}
              >
                <option value="true">Có</option>
                <option value="false">Không</option>
              </select>
            ) : (
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                className={sel}
                value={specs[field.key] ?? ''}
                onChange={(e) =>
                  update(
                    field.key,
                    field.type === 'number' ? Number(e.target.value) : e.target.value
                  )
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
