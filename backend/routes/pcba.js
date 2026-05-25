import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, persistCollection } from '../services/db.js';
import { validatePcbaInput, ValidationError } from '../models/validators.js';
import { resolveFirmwareForProduct } from '../services/lifecycle.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const enriched = db.pcba.map((pcba) => ({
    ...pcba,
    skus: db.products.filter((p) => p.pcbaId === pcba.id),
  }));
  res.json({ total: enriched.length, items: enriched });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const pcba = db.pcba.find((p) => p.id === req.params.id);
  if (!pcba) return res.status(404).json({ error: 'PCBA not found' });

  const skus = db.products
    .filter((p) => p.pcbaId === pcba.id)
    .map((p) => ({
      ...p,
      resolvedFirmwareId: resolveFirmwareForProduct(p, db.pcba),
    }));

  res.json({ pcba, skus });
});

router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    validatePcbaInput(req.body);

    if (db.pcba.some((p) => p.code === req.body.code)) {
      throw new ValidationError('PCBA code already exists');
    }

    const now = new Date().toISOString();
    const pcba = {
      id: uuidv4(),
      code: req.body.code.trim(),
      name: req.body.name.trim(),
      description: req.body.description || '',
      linkedSkuIds: [],
      firmwareBindings: req.body.firmwareBindings || [],
      createdAt: now,
      updatedAt: now,
    };

    db.pcba.push(pcba);
    await persistCollection('pcba');
    res.status(201).json(pcba);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const idx = db.pcba.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'PCBA not found' });

    validatePcbaInput(req.body);
    const now = new Date().toISOString();
    db.pcba[idx] = {
      ...db.pcba[idx],
      ...req.body,
      id: db.pcba[idx].id,
      createdAt: db.pcba[idx].createdAt,
      updatedAt: now,
    };

    await persistCollection('pcba');
    res.json(db.pcba[idx]);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/link-sku', async (req, res, next) => {
  try {
    const db = getDb();
    const pcba = db.pcba.find((p) => p.id === req.params.id);
    if (!pcba) return res.status(404).json({ error: 'PCBA not found' });

    const { skuId, hardwareVersion, firmwareId } = req.body;
    const product = db.products.find((p) => p.id === skuId);
    if (!product) throw new ValidationError('SKU not found');

    const now = new Date().toISOString();
    product.pcbaId = pcba.id;
    if (hardwareVersion) product.hardwareVersion = hardwareVersion;
    if (firmwareId) product.firmwareId = firmwareId;
    product.updatedAt = now;

    if (!pcba.linkedSkuIds.includes(product.id)) {
      pcba.linkedSkuIds.push(product.id);
    }
    pcba.updatedAt = now;

    await persistCollection('products');
    await persistCollection('pcba');
    res.json({ pcba, product });
  } catch (err) {
    next(err);
  }
});

export default router;
