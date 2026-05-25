/**
 * Smoke test: CRUD + lifecycle force-update (must all return 2xx).
 * Run: node scripts/smoke-test.js (API must be on :3001)
 */

const BASE = process.env.API_BASE || 'http://localhost:3001/api';

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

function assert(name, condition, detail = '') {
  if (!condition) {
    console.error(`FAIL: ${name}`, detail);
    process.exit(1);
  }
  console.log(`OK: ${name}`);
}

const sample = {
  commercialSku: `TEST-SKU-${Date.now()}`,
  name: 'Smoke Test Switch',
  systemRole: 'PERIPHERAL_HUB',
  productCategory: 'SWITCH',
  region: 'VN',
  protocol: 'ZIGBEE_3',
  lifecycle: 'RND',
  imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200',
  listPrice: '599.000đ',
  salesSpecs: { maxLoadW: 800, neutralWire: 'WITH_NEUTRAL', mountType: 'SQUARE', channels: 1 },
  installationSteps: [
    'Bước 1: Ngắt nguồn điện tại aptomat.',
    'Bước 2: Đấu dây L và N vào cọc nguồn.',
    'Bước 3: Gắn thiết bị vào đế âm và bật điện.',
  ],
  wiringDiagramUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  dimensions: { widthMm: 86, heightMm: 86, depthMm: 34 },
  weightG: 120,
};

async function run() {
  const health = await req('GET', '/health');
  assert('health', health.ok, health.status);

  const created = await req('POST', '/products', sample);
  assert('create product', created.ok && created.status === 201, created.data);
  const id = created.data.id;

  const toCashCow = await req('PUT', `/products/${id}`, { lifecycle: 'CASH_COW' });
  assert('lifecycle → CASH_COW', toCashCow.ok, toCashCow.data);

  const toRnd = await req('PUT', `/products/${id}`, { lifecycle: 'RND' });
  assert('lifecycle force → RND (no block)', toRnd.ok, toRnd.data);

  const toLegacy = await req('PUT', `/products/${id}`, { lifecycle: 'LEGACY' });
  assert('lifecycle → LEGACY', toLegacy.ok);

  const getOne = await req('GET', `/products/${id}`);
  assert('get has installationSteps', getOne.data.product?.installationSteps?.length >= 3);
  assert('get has dimensions', getOne.data.product?.dimensions?.widthMm === 86);

  const list = await req('GET', '/products?productCategory=SWITCH');
  assert('list filter', list.ok && list.data.total >= 1);

  const removed = await req('DELETE', `/products/${id}`);
  assert('delete', removed.ok);

  const serial = await req('GET', '/serials/check?serialNumber=GL2025GW0002001&market=GLOBAL');
  assert('serial check', serial.ok && serial.data.status === 'SUPPORTED');

  console.log('\nAll smoke tests passed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
