import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, persistCollection } from '../services/db.js';
import {
  validateSerialInput,
  validateActivationRequest,
  ValidationError,
} from '../models/validators.js';
import { evaluateGeofence } from '../services/geofencing.js';
import { normalizeSalesProduct } from '../services/salesNormalize.js';
import { REGION_LABELS } from '../models/salesCatalog.js';

const router = Router();

function salesCheckMessage(serial, geo, product, market) {
  if (!serial) {
    return {
      status: 'NOT_FOUND',
      title: 'Không tìm thấy Serial',
      message: 'Mã Serial không có trong hệ thống. Vui lòng kiểm tra lại tem sản phẩm.',
      supported: false,
    };
  }

  if (serial.region === 'MAINLAND_CHINA' && market === 'GLOBAL') {
    return {
      status: 'DOMESTIC_REJECTED',
      title: 'Hàng nội địa — Từ chối kích hoạt',
      message:
        'Đây là hàng Mainland China. Không thể kích hoạt trên server quốc tế (Global). Sales cần hướng dẫn khách dùng server China.',
      supported: false,
      regionLabel: REGION_LABELS.MAINLAND_CHINA,
    };
  }

  if (!geo.allowed) {
    return {
      status: 'DOMESTIC_REJECTED',
      title: 'Không hỗ trợ vùng này',
      message: geo.reason || 'Serial không khớp thị trường đích.',
      supported: false,
      regionLabel: REGION_LABELS[serial.region],
    };
  }

  return {
    status: 'SUPPORTED',
    title: 'Hàng quốc tế — Hỗ trợ',
    message: `Serial hợp lệ cho thị trường ${REGION_LABELS[serial.region] || serial.region}. Có thể tư vấn kích hoạt bình thường.`,
    supported: true,
    regionLabel: REGION_LABELS[serial.region],
    productName: product?.name,
    productSku: product?.commercialSku,
  };
}

router.get('/check', (req, res) => {
  const db = getDb();
  const serialNumber = String(req.query.serialNumber || '')
    .trim()
    .toUpperCase();
  const market = req.query.market || 'GLOBAL';

  if (!serialNumber) {
    return res.status(400).json({ error: 'serialNumber is required' });
  }

  const serial = db.serials.find((s) => s.serialNumber === serialNumber);
  const product = serial
    ? normalizeSalesProduct(db.products.find((p) => p.id === serial.skuId) || {})
    : null;

  const geo = evaluateGeofence({
    serialRegion: serial?.region || 'GLOBAL',
    activationServer: market,
    serialNumber,
  });

  const sales = salesCheckMessage(serial, geo, product, market);

  res.json({
    serialNumber,
    market,
    ...sales,
    serial: serial || null,
    product: product?.id ? product : null,
  });
});

router.get('/', (req, res) => {
  const db = getDb();
  let items = [...db.serials];
  const { region, skuId } = req.query;
  if (region) items = items.filter((s) => s.region === region);
  if (skuId) items = items.filter((s) => s.skuId === skuId);

  const enriched = items.map((s) => ({
    ...s,
    sku: db.products.find((p) => p.id === s.skuId) || null,
  }));

  res.json({ total: enriched.length, items: enriched });
});

router.post('/activate', async (req, res, next) => {
  try {
    const db = getDb();
    validateActivationRequest(req.body);

    const { serialNumber, activationServer } = req.body;
    const serial = db.serials.find(
      (s) => s.serialNumber === serialNumber.trim().toUpperCase()
    );

    if (!serial) {
      return res.status(404).json({
        error: 'Serial not found',
        allowed: false,
        status: 'NOT_FOUND',
      });
    }

    const geo = evaluateGeofence({
      serialRegion: serial.region,
      activationServer,
      serialNumber: serial.serialNumber,
    });

    const product = normalizeSalesProduct(
      db.products.find((p) => p.id === serial.skuId) || {}
    );
    const sales = salesCheckMessage(serial, geo, product, activationServer);

    if (!geo.allowed) {
      serial.blocked = true;
      serial.blockReason = geo.reason;
      await persistCollection('serials');
      return res.status(403).json({ allowed: false, ...sales });
    }

    serial.activated = true;
    serial.activatedAt = new Date().toISOString();
    serial.activationServer = activationServer;
    serial.blocked = false;
    await persistCollection('serials');

    res.json({ allowed: true, ...sales, serial });
  } catch (err) {
    next(err);
  }
});

export default router;
