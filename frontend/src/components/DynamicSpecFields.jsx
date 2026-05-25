export default function DynamicSpecFields({ meta, category, specs, onChange }) {
  const fields = meta?.techSpecFields?.[category] || [];

  if (!fields.length) {
    return (
      <p className="text-xs text-slate-500">Chọn danh mục để hiện thông số kỹ thuật.</p>
    );
  }

  const sel =
    'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';

  function update(key, value) {
    onChange({ ...specs, [key]: value });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs text-slate-500 mb-1">
            {field.label}
            {field.unit ? ` (${field.unit})` : ''}
          </label>
          {field.type === 'select' ? (
            <select
              className={sel}
              value={specs[field.key] ?? ''}
              onChange={(e) => update(field.key, e.target.value)}
            >
              <option value="">—</option>
              {(field.options || []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : field.type === 'boolean' ? (
            <select
              className={sel}
              value={specs[field.key] === true ? 'true' : specs[field.key] === false ? 'false' : ''}
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
      ))}
    </div>
  );
}
