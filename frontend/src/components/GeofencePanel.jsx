import { useState } from 'react';
import { api } from '../api/client';
import { Badge } from './Badge';

const SERVERS = ['GLOBAL', 'CHINA', 'EU', 'US', 'VN'];

export default function GeofencePanel({ serials, onRefresh }) {
  const [serialNumber, setSerialNumber] = useState('CN2025GW0001001');
  const [server, setServer] = useState('GLOBAL');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleActivate(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await api.activateSerial(serialNumber, server);
      setResult({ type: 'success', data });
    } catch (err) {
      setResult({ type: 'blocked', data: err.data, message: err.message });
    } finally {
      setLoading(false);
      onRefresh?.();
    }
  }

  const blockedCount = serials.filter((s) => s.blocked).length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
        <p className="text-sm text-red-300">
          <strong>Geofencing:</strong> Serial thuộc vùng Mainland China kích hoạt trên Global
          Server sẽ bị <strong>auto-block</strong>.
        </p>
        <p className="mt-1 text-xs text-red-400/80">
          Đã block: {blockedCount} / {serials.length} serial
        </p>
      </div>

      <form onSubmit={handleActivate} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-slate-500 mb-1">Serial Number</label>
          <input
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none"
            placeholder="CN2025GW0001001"
          />
        </div>
        <div className="w-40">
          <label className="block text-xs text-slate-500 mb-1">Activation Server</label>
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {SERVERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Kích hoạt'}
        </button>
      </form>

      {result && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            result.type === 'success'
              ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
              : 'border-red-800 bg-red-950/40 text-red-300'
          }`}
        >
          {result.type === 'success' ? (
            <p>✓ {result.data.message}</p>
          ) : (
            <>
              <p className="font-semibold">✗ BLOCKED</p>
              <p className="mt-1 text-xs">{result.data?.reason || result.message}</p>
              {result.data?.expectedServer && (
                <p className="mt-1 text-xs">
                  Server yêu cầu: <strong>{result.data.expectedServer}</strong>
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
              <th className="px-3 py-2">Serial</th>
              <th className="px-3 py-2">Vùng</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {serials.map((s) => (
              <tr key={s.id} className="border-t border-slate-800/60">
                <td className="px-3 py-2 font-mono text-xs">{s.serialNumber}</td>
                <td className="px-3 py-2">{s.region}</td>
                <td className="px-3 py-2 text-xs text-slate-400">
                  {s.sku?.commercialSku || s.skuId}
                </td>
                <td className="px-3 py-2">
                  {s.blocked ? (
                    <Badge className="border-red-700 bg-red-900/40 text-red-300">BLOCKED</Badge>
                  ) : s.activated ? (
                    <Badge className="border-emerald-700 bg-emerald-900/40 text-emerald-300">
                      ACTIVE
                    </Badge>
                  ) : (
                    <Badge className="border-slate-700 text-slate-400">IDLE</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
