import { Router } from 'express';
import { getDb } from '../services/db.js';
import { getLifecycleStats } from '../services/lifecycle.js';
import { normalizeSalesProduct } from '../services/salesNormalize.js';
import {
  SYSTEM_ROLE_LABELS,
  PRODUCT_CATEGORY_LABELS,
  REGION_LABELS,
  LIFECYCLE_LABELS,
  LIFECYCLE_STATUSES,
  displayCategoryLabel,
} from '../models/salesCatalog.js';

const router = Router();

router.get('/summary', (_req, res) => {
  const db = getDb();
  const products = db.products.map((p) => normalizeSalesProduct({ ...p }));

  const bySystemRole = {};
  const byProductCategory = {};
  const byRegion = {};
  const byLifecycle = {};
  let activationSum = 0;
  let offlineSum = 0;

  for (const p of products) {
    bySystemRole[p.systemRole] = (bySystemRole[p.systemRole] || 0) + 1;
    const catKey = p.systemRole === 'HUB_CENTRAL' ? 'HUB' : p.productCategory;
    byProductCategory[catKey] = (byProductCategory[catKey] || 0) + 1;
    byRegion[p.region] = (byRegion[p.region] || 0) + 1;
    byLifecycle[p.lifecycle] = (byLifecycle[p.lifecycle] || 0) + 1;
    activationSum += p.activationRate;
    offlineSum += p.offlineRate;
  }

  const lifecycleStats = getLifecycleStats(products);
  const n = products.length || 1;

  const replacementRoadmap = products
    .filter((p) => p.successorId)
    .map((p) => {
      const next = products.find((s) => s.id === p.successorId);
      return {
        from: {
          id: p.id,
          sku: p.commercialSku,
          name: p.name,
          lifecycle: p.lifecycle,
          lifecycleLabel: LIFECYCLE_LABELS[p.lifecycle],
          imageUrl: p.imageUrl,
          categoryDisplay: displayCategoryLabel(p),
        },
        to: next
          ? {
              id: next.id,
              sku: next.commercialSku,
              name: next.name,
              lifecycle: next.lifecycle,
              lifecycleLabel: LIFECYCLE_LABELS[next.lifecycle],
              imageUrl: next.imageUrl,
              categoryDisplay: displayCategoryLabel(next),
            }
          : null,
      };
    });

  res.json({
    totals: {
      products: products.length,
      serials: db.serials.length,
      avgActivationRate: Math.round((activationSum / n) * 10) / 10,
      avgOfflineRate: Math.round((offlineSum / n) * 10) / 10,
      activeSelling: products.filter((p) => p.lifecycle === 'CASH_COW').length,
      upcoming: products.filter((p) => p.lifecycle === 'RND').length,
    },
    bySystemRole: Object.entries(bySystemRole).map(([k, count]) => ({
      key: k,
      label: SYSTEM_ROLE_LABELS[k],
      count,
    })),
    byProductCategory: Object.entries(byProductCategory).map(([k, count]) => ({
      key: k,
      label: k === 'HUB' ? 'Bộ trung tâm' : PRODUCT_CATEGORY_LABELS[k] || k,
      count,
    })),
    byRegion: Object.entries(byRegion).map(([k, count]) => ({
      key: k,
      label: REGION_LABELS[k],
      count,
    })),
    lifecycleStats,
    lifecycleBreakdown: LIFECYCLE_STATUSES.map((k) => ({
      key: k,
      label: LIFECYCLE_LABELS[k],
      count: byLifecycle[k] || 0,
    })),
    replacementRoadmap,
  });
});

export default router;
