import { useState } from 'react';
import { api } from '../api/client';

export default function SerialRegionCheck() {
  const [serial, setSerial] = useState('CN2025GW0001001');
  const [market, setMarket] = useState('GLOBAL');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck(e) {
    e.preventDefault();
    if (!serial.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await api.checkSerial(serial.trim(), market);
      setResult(data);
    } catch (err) {
      setResult({
        status: 'ERROR',
        title: 'Lỗi kiểm tra',
        message: err.message,
        supported: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const isOk = result?.status === 'SUPPORTED';
  const isReject = result?.status === 'DOMESTIC_REJECTED';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Kiểm tra Serial & Vùng</h2>
        <p className="text-sm text-slate-500 mt-1">
          Nhập Serial để Sales xác nhận hàng quốc tế hay nội địa
        </p>
      </div>

      <form
        onSubmit={handleCheck}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl"
      >
        <div>
          <label className="block text-xs text-slate-500 mb-2">Serial Number</label>
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-mono text-lg focus:border-brand-500 focus:outline-none"
            value={serial}
            onChange={(e) => setSerial(e.target.value.toUpperCase())}
            placeholder="VD: GL2025GW0002001"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-2">Thị trường kích hoạt (mô phỏng)</label>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
          >
            <option value="GLOBAL">Quốc tế (Global)</option>
            <option value="CHINA">Trung Quốc (China)</option>
            <option value="VN">Việt Nam</option>
            <option value="EU">EU</option>
            <option value="US">US</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold hover:bg-brand-500 disabled:opacity-50"
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}
        </button>
      </form>

      {result && (
        <div
          className={`rounded-2xl border p-6 text-center ${
            isOk
              ? 'border-emerald-700 bg-emerald-950/40'
              : isReject
                ? 'border-red-700 bg-red-950/40'
                : 'border-slate-700 bg-slate-900/60'
          }`}
        >
          <p
            className={`text-lg font-bold ${
              isOk ? 'text-emerald-400' : isReject ? 'text-red-400' : 'text-amber-400'
            }`}
          >
            {result.title}
          </p>
          <p className="text-sm text-slate-300 mt-3">{result.message}</p>
          {result.productSku && (
            <p className="text-xs text-slate-500 mt-4 font-mono">
              SKU: {result.productSku} · {result.productName}
            </p>
          )}
          <p className="text-xs text-slate-600 mt-2 font-mono">{result.serialNumber}</p>
        </div>
      )}

      <p className="text-xs text-center text-slate-600">
        Thử: <code className="text-brand-400">GL2025GW0002001</code> (hỗ trợ) ·{' '}
        <code className="text-red-400">CN2025GW0001001</code> trên Global (từ chối)
      </p>
    </div>
  );
}
