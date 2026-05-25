import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, persistCollection } from '../services/db.js';
import {
  validateProductInput,
  validateSuccessorLink,
  ValidationError,
} from '../models/validators.js';
import { buildSalesPayload, normalizeSalesProduct } from '../services/salesNormalize.js';
import { displayCategoryLabel } from '../models/salesCatalog.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  let items = db.products.map((p) => normalizeSalesProduct({ ...p }));

  const { systemRole, productCategory, region, protocol, lifecycle, q } = req.query;
  if (systemRole) items = items.filter((p) => p.systemRole === systemRole);
  if (productCategory) items = items.filter((p) => p.productCategory === productCategory);
  if (region) items = items.filter((p) => p.region === region);
  if (protocol) items = items.filter((p) => p.protocol === protocol);
  if (lifecycle) items = items.filter((p) => p.lifecycle === lifecycle);
  if (q) {
    const term = String(q).toLowerCase();
    items = items.filter(
      (p) =>
        p.commercialSku.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        displayCategoryLabel(p).toLowerCase().includes(term)
    );
  }

  const enriched = items.map((p) => ({
    ...p,
    categoryDisplay: displayCategoryLabel(p),
  }));

  res.json({ total: enriched.length, items: enriched });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const raw = db.products.find((p) => p.id === req.params.id);
  if (!raw) return res.status(404).json({ error: 'Product not found' });

  const product = normalizeSalesProduct({ ...raw });
  product.categoryDisplay = displayCategoryLabel(product);

  const predecessor = product.predecessorId
    ? normalizeSalesProduct({ ...db.products.find((p) => p.id === product.predecessorId) })
    : null;
  const successor = product.successorId
    ? normalizeSalesProduct({ ...db.products.find((p) => p.id === product.successorId) })
    : null;

  res.json({ product, predecessor, successor });
});

router.post('/', async (req, res, next) => {
  try {
    const db = getDb();
    validateProductInput(req.body);

    if (db.products.some((p) => p.commercialSku === req.body.commercialSku)) {
      throw new ValidationError('commercialSku already exists');
    }

    const now = new Date().toISOString();
    const built = buildSalesPayload(req.body);
    const product = {
      id: uuidv4(),
      ...built,
      predecessorId: req.body.predecessorId || null,
      successorId: null,
      createdAt: now,
      updatedAt: now,
    };

    if (product.predecessorId) {
      const pred = db.products.find((p) => p.id === product.predecessorId);
      validateSuccessorLink(pred, product);
      pred.successorId = product.id;
      pred.updatedAt = now;
    }

    db.products.push(product);
    await persistCollection('products');

    const out = normalizeSalesProduct(product);
    out.categoryDisplay = displayCategoryLabel(out);
    res.status(201).json(out);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const existing = db.products[idx];
    validateProductInput(req.body, { isUpdate: true, existing });

    if (
      req.body.commercialSku &&
      db.products.some(
        (p) => p.commercialSku === req.body.commercialSku && p.id !== existing.id
      )
    ) {
      throw new ValidationError('commercialSku already exists');
    }

    const now = new Date().toISOString();
    const built = buildSalesPayload({ ...existing, ...req.body }, existing);
    db.products[idx] = {
      ...existing,
      ...built,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    await persistCollection('products');
    const out = normalizeSalesProduct(db.products[idx]);
    out.categoryDisplay = displayCategoryLabel(out);
    res.json(out);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/deprecate', async (req, res, next) => {
  try {
    const db = getDb();
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const existing = db.products[idx];
    existing.lifecycle = 'DEPRECATED';
    existing.updatedAt = new Date().toISOString();
    db.products[idx] = normalizeSalesProduct(existing);
    await persistCollection('products');
    res.json(db.products[idx]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res) => {
  const db = getDb();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const [removed] = db.products.splice(idx, 1);

  if (removed.predecessorId) {
    const pred = db.products.find((p) => p.id === removed.predecessorId);
    if (pred) pred.successorId = null;
  }
  if (removed.successorId) {
    const succ = db.products.find((p) => p.id === removed.successorId);
    if (succ) succ.predecessorId = null;
  }

  db.serials = db.serials.filter((s) => s.skuId !== removed.id);
  await persistCollection('products');
  await persistCollection('serials');
  res.json({ deleted: removed.id });
});

export default router;
