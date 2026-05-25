import { Badge } from './Badge';
import { labelFor, lifecycleClass, tierClass } from '../api/client';

function formatTierAttrs(product) {
  const a = product.tierAttributes || {};
  switch (product.tier) {
    case 'HUB':
      return `Load ${a.maxDeviceLoad} | RAM ${a.ramMb}MB | CPU ${a.cpuMhz}MHz`;
    case 'ACTUATOR':
      return `${a.channels ?? 1}CH`;
    case 'SENSOR':
      return `${a.batteryType} | ${a.powerConsumptionLevel}`;
    case 'STANDALONE':
      return `${(a.connectivity || []).join('+')} | AI: ${a.hasAi ? 'Yes' : 'No'}`;
    default:
      return '';
  }
}

const TIER_ORDER = ['HUB', 'ACTUATOR', 'SENSOR', 'STANDALONE'];

export default function ProductHierarchy({ meta, products, onSelect }) {
  const grouped = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = products.filter((p) => p.tier === tier);
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {TIER_ORDER.map((tier) => (
        <section
          key={tier}
          className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
        >
          <header className="border-b border-slate-800 px-4 py-3 bg-slate-800/40">
            <div className="flex items-center gap-2">
              <Badge className={tierClass(meta, tier)}>{labelFor(meta, 'tier', tier)}</Badge>
              <span className="text-xs text-slate-500">({grouped[tier].length})</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {labelFor(meta, 'segment', grouped[tier][0]?.segment)}
            </p>
          </header>
          <ul className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
            {grouped[tier].length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-600">Trống</li>
            ) : (
              grouped[tier].map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(p)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs text-brand-400">{p.commercialSku}</span>
                      <Badge className={lifecycleClass(meta, p.lifecycle)}>
                        {labelFor(meta, 'lifecycle', p.lifecycle)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-300 truncate">{p.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatTierAttrs(p)}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {labelFor(meta, 'segment', p.segment)} · {p.activationRate}% act.
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
