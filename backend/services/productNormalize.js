import {
  SEGMENTS,
  MECHANICAL_MOUNTS,
  ELECTRICAL_NEUTRAL_TYPES,
  SOFTWARE_FEATURES,
  inferSegment,
  inferMechanicalMount,
  inferElectricalNeutral,
} from '../models/schemas.js';
import {
  resolveProductMediaAndSpecs,
  inferCategory,
  getCategoriesForTier,
} from './categorySpecs.js';

const MOUNT_TO_LEGACY = {
  SQUARE_UK_VN: 'SQUARE',
  RECT_US: 'RECTANGLE',
  ROUND_EU: 'RECTANGLE',
};

const NEUTRAL_TO_LEGACY = {
  WITH_NEUTRAL: 'NEUTRAL',
  NO_NEUTRAL: 'NO_NEUTRAL',
};

export function syncActuatorTierAttributes(product) {
  if (product.tier !== 'ACTUATOR') return product;
  const attrs = { ...(product.tierAttributes || {}) };
  if (product.mechanicalMount) {
    attrs.mountStandard = MOUNT_TO_LEGACY[product.mechanicalMount] || attrs.mountStandard;
  }
  if (product.electricalNeutral) {
    attrs.powerType = NEUTRAL_TO_LEGACY[product.electricalNeutral] || attrs.powerType;
  }
  const ch = product.technicalSpecs?.channels;
  if (ch != null) attrs.channels = ch;
  product.tierAttributes = attrs;
  return product;
}

export function normalizeProduct(raw) {
  const p = { ...raw };

  if (!p.segment || !SEGMENTS.includes(p.segment)) p.segment = inferSegment(p);
  if (!p.mechanicalMount || !MECHANICAL_MOUNTS.includes(p.mechanicalMount)) {
    p.mechanicalMount = inferMechanicalMount(p);
  }
  if (!p.electricalNeutral || !ELECTRICAL_NEUTRAL_TYPES.includes(p.electricalNeutral)) {
    p.electricalNeutral = inferElectricalNeutral(p);
  }
  if (!p.whiteLabelBrand) p.whiteLabelBrand = 'SmartHome OEM';
  if (!p.softwareFeature || !SOFTWARE_FEATURES.includes(p.softwareFeature)) {
    p.softwareFeature = p.tier === 'STANDALONE' && p.tierAttributes?.hasAi ? 'SUBSCRIPTION' : 'FREE';
  }
  if (typeof p.activationRate !== 'number') p.activationRate = 75 + Math.floor(Math.random() * 20);
  if (typeof p.offlineRate !== 'number') p.offlineRate = 1 + Math.floor(Math.random() * 8);

  p.activationRate = Math.min(100, Math.max(0, Number(p.activationRate)));
  p.offlineRate = Math.min(100, Math.max(0, Number(p.offlineRate)));

  const tier = p.tier || 'ACTUATOR';
  const cats = getCategoriesForTier(tier);
  if (!p.category || !cats.some((c) => c.value === p.category)) {
    p.category = inferCategory(p);
  }

  const resolved = resolveProductMediaAndSpecs(p);
  p.category = resolved.category;
  p.technicalSpecs = resolved.technicalSpecs;
  p.imageUrl = resolved.imageUrl;

  return syncActuatorTierAttributes(p);
}

export function buildProductPayload(body, existing = null) {
  const tier = body.tier ?? existing?.tier ?? 'ACTUATOR';
  const base = {
    commercialSku: body.commercialSku?.trim() ?? existing?.commercialSku,
    name: body.name?.trim() ?? existing?.name,
    tier,
    category: body.category ?? existing?.category,
    imageUrl: body.imageUrl ?? existing?.imageUrl,
    technicalSpecs: body.technicalSpecs ?? existing?.technicalSpecs,
    region: body.region ?? existing?.region ?? 'GLOBAL',
    protocol: body.protocol ?? existing?.protocol ?? 'ZIGBEE_3',
    lifecycle: body.lifecycle ?? existing?.lifecycle ?? 'RND',
    segment: body.segment ?? existing?.segment,
    mechanicalMount: body.mechanicalMount ?? existing?.mechanicalMount,
    electricalNeutral: body.electricalNeutral ?? existing?.electricalNeutral,
    whiteLabelBrand: body.whiteLabelBrand ?? existing?.whiteLabelBrand ?? 'SmartHome OEM',
    softwareFeature: body.softwareFeature ?? existing?.softwareFeature ?? 'FREE',
    activationRate: body.activationRate ?? existing?.activationRate ?? 80,
    offlineRate: body.offlineRate ?? existing?.offlineRate ?? 3,
    pcbaId: body.pcbaId !== undefined ? body.pcbaId : existing?.pcbaId ?? null,
    firmwareId: body.firmwareId ?? existing?.firmwareId ?? '',
    hardwareVersion: body.hardwareVersion ?? existing?.hardwareVersion ?? 'v1.0',
    tierAttributes: body.tierAttributes ?? existing?.tierAttributes ?? {},
    description: body.description ?? existing?.description ?? '',
    predecessorId: body.predecessorId !== undefined ? body.predecessorId : existing?.predecessorId ?? null,
  };

  return normalizeProduct(base);
}

export function migrateProducts(products) {
  return products.map((p) => normalizeProduct(p));
}
