import { useState } from 'react';
import { formatSpecsSummary } from '../api/client';

export function ProductThumbnail({ imageUrl, name, size = 40 }) {
  const [err, setErr] = useState(false);
  const px = `${size}px`;

  if (err || !imageUrl) {
    return (
      <div
        className="rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-lg"
        style={{ width: px, height: px }}
        title={name}
      >
        📦
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className="rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-800"
      style={{ width: px, height: px }}
      onError={() => setErr(true)}
    />
  );
}

export default function SpecsTooltip({ meta, product, children }) {
  const [open, setOpen] = useState(false);
  const lines = formatSpecsSummary(meta, product);

  return (
    <span
      className="relative inline-block max-w-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-600 bg-slate-900 p-3 shadow-2xl pointer-events-none">
          <p className="text-xs font-semibold text-brand-400 mb-2">Thông số bán hàng</p>
          {lines.length ? (
            <ul className="space-y-1 text-xs text-slate-300">
              {lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">Chưa có thông số.</p>
          )}
        </div>
      )}
    </span>
  );
}
