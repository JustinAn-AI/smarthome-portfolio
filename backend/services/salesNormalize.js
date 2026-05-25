import {
  SYSTEM_ROLES,
  PRODUCT_CATEGORIES,
  LIFECYCLE_STATUSES,
  REGIONS,
  PROTOCOLS,
  getDefaultSalesSpecs,
  getDefaultImageUrl,
  SALES_SPEC_FIELDS,
} from '../models/salesCatalog.js';

const LEGACY_CATEGORY_MAP = {
  HUB_GATEWAY: { systemRole: 'HUB_CENTRAL', productCategory: 'SWITCH' },
  HUB_SMART_PANEL: { systemRole: 'HUB_CENTRAL', productCategory: 'SWITCH' },
  HUB_REPEATER: { systemRole: 'HUB_CENTRAL', productCategory: 'SWITCH' },
  ACT_SWITCH: { systemRole: 'PERIPHERAL_HUB', productCategory: 'SWITCH' },
  ACT_SOCKET: { systemRole: 'PERIPHERAL_HUB', productCategory: 'SOCKET' },
  ACT_LIGHTING: { systemRole: 'PERIPHERAL_HUB', productCategory: 'LIGHTING' },
  ACT_CURTAIN: { systemRole: 'PERIPHERAL_HUB', productCategory: 'CURTAIN' },
  ACT_RELAY: { systemRole: 'PERIPHERAL_HUB', productCategory: 'SWITCH' },
  SNS_ENVIRONMENT: { systemRole: 'PERIPHERAL_HUB', productCategory: 'SENSOR' },
  SNS_SECURITY: { systemRole: 'PERIPHERAL_HUB', productCategory: 'SENSOR' },
  SNS_PRESENCE: { systemRole: 'PERIPHERAL_HUB', productCategory: 'SENSOR' },
  STD_CAMERA: { systemRole: 'STANDALONE_CLOUD', productCategory: 'SECURITY' },
  STD_LOCK: { systemRole: 'STANDALONE_CLOUD', productCategory: 'SECURITY' },
  STD_APPLIANCE: { systemRole: 'STANDALONE_CLOUD', productCategory: 'SOCKET' },
};

function mapLegacyTier(tier) {
  if (tier === 'HUB') return 'HUB_CENTRAL';
  if (tier === 'STANDALONE') return 'STANDALONE_CLOUD';
  return 'PERIPHERAL_HUB';
}

function inferFromLegacy(p) {
  if (p.systemRole && SYSTEM_ROLES.includes(p.systemRole)) {
    return {
      systemRole: p.systemRole,
      productCategory: p.productCategory || 'SWITCH',
    };
  }

  if (p.category && LEGACY_CATEGORY_MAP[p.category]) {
    return LEGACY_CATEGORY_MAP[p.category];
  }

  const tier = p.tier || 'ACTUATOR';
  const systemRole = mapLegacyTier(tier);
  const name = (p.name || '').toLowerCase();

  if (systemRole === 'HUB_CENTRAL') {
    return { systemRole, productCategory: 'SWITCH' };
  }
  if (systemRole === 'STANDALONE_CLOUD') {
    if (name.includes('lock') || name.includes('khóa')) {
      return { systemRole, productCategory: 'SECURITY' };
    }
    if (name.includes('cam')) return { systemRole, productCategory: 'SECURITY' };
    return { systemRole, productCategory: 'SECURITY' };
  }
  if (name.includes('socket') || name.includes('ổ cắm')) {
    return { systemRole, productCategory: 'SOCKET' };
  }
  if (name.includes('light') || name.includes('đèn')) {
    return { systemRole, productCategory: 'LIGHTING' };
  }
  if (name.includes('curtain') || name.includes('rèm')) {
    return { systemRole, productCategory: 'CURTAIN' };
  }
  if (name.includes('sensor') || name.includes('cảm biến') || tier === 'SENSOR') {
    return { systemRole, productCategory: 'SENSOR' };
  }
  return { systemRole, productCategory: 'SWITCH' };
}

function migrateLegacySpecs(p, productCategory) {
  const old = p.salesSpecs || p.technicalSpecs || {};
  const ta = p.tierAttributes || {};

  if (productCategory === 'SWITCH' || productCategory === 'SOCKET') {
    return {
      maxLoadW: old.maxLoadW ?? 800,
      neutralWire:
        old.neutralWire ||
        (p.electricalNeutral === 'NO_NEUTRAL' ? 'NO_NEUTRAL' : 'WITH_NEUTRAL'),
      mountType:
        old.mountType ||
        (p.mechanicalMount?.includes('RECT') ? 'RECTANGLE' : 'SQUARE'),
      channels: old.channels ?? ta.channels ?? 1,
      usbPorts: old.usbPorts,
    };
  }
  if (productCategory === 'LIGHTING') {
    return {
      lumens: old.lumens ?? 800,
      wattageW: old.wattageW ?? 12,
      colorMode: old.colorMode ?? 'CCT',
    };
  }
  if (productCategory === 'SENSOR') {
    return {
      batteryType: old.batteryType ?? ta.batteryType ?? 'CR2032',
      detectionRangeM: old.detectionRangeM ?? 7,
      sensorSubtype: old.sensorSubtype ?? (ta.sensorTypes || ['Motion'])[0],
    };
  }
  if (productCategory === 'CURTAIN') {
    return {
      maxLoadKg: old.maxLoadKg ?? 40,
      trackLengthM: old.trackLengthM ?? 3,
      voltageV: old.voltageV ?? 220,
    };
  }
  if (productCategory === 'SECURITY') {
    return {
      resolution: old.resolution ?? ta.resolution ?? '2K',
      connectivity: old.connectivity ?? (ta.connectivity || ['Wi-Fi']).join(', '),
      nightVision: old.nightVision ?? true,
    };
  }
  return old;
}

export function sanitizeSalesSpecs(productCategory, specs, systemRole) {
  if (systemRole === 'HUB_CENTRAL') {
    const input = specs && typeof specs === 'object' ? specs : {};
    return {
      maxChildDevices: Number(input.maxChildDevices) || 128,
      powerPort: input.powerPort || 'USB Type-C',
      ethernet: input.ethernet !== false,
    };
  }

  const fields = SALES_SPEC_FIELDS[productCategory] || [];
  const input = specs && typeof specs === 'object' ? specs : {};
  const out = {};

  for (const field of fields) {
    const val = input[field.key];
    if (val === undefined || val === null || val === '') continue;
    if (field.type === 'number') out[field.key] = Number(val);
    else if (field.type === 'boolean') out[field.key] = Boolean(val);
    else out[field.key] = val;
  }

  return Object.keys(out).length ? out : getDefaultSalesSpecs(productCategory);
}

export function normalizeSalesProduct(raw) {
  const p = { ...raw };
  const { systemRole, productCategory: inferredCat } = inferFromLegacy(p);

  p.systemRole = SYSTEM_ROLES.includes(p.systemRole) ? p.systemRole : systemRole;
  p.productCategory = PRODUCT_CATEGORIES.includes(p.productCategory)
    ? p.productCategory
    : inferredCat;

  if (!REGIONS.includes(p.region)) p.region = 'GLOBAL';
  if (!PROTOCOLS.includes(p.protocol)) p.protocol = 'ZIGBEE_3';
  if (!LIFECYCLE_STATUSES.includes(p.lifecycle)) p.lifecycle = 'RND';

  p.salesSpecs = sanitizeSalesSpecs(
    p.productCategory,
    migrateLegacySpecs(p, p.productCategory),
    p.systemRole
  );

  p.imageUrl =
    p.imageUrl && String(p.imageUrl).trim()
      ? String(p.imageUrl).trim()
      : getDefaultImageUrl(p.productCategory, p.systemRole);

  if (typeof p.activationRate !== 'number') p.activationRate = 80;
  if (typeof p.offlineRate !== 'number') p.offlineRate = 3;
  p.activationRate = Math.min(100, Math.max(0, Number(p.activationRate)));
  p.offlineRate = Math.min(100, Math.max(0, Number(p.offlineRate)));

  p.listPrice = p.listPrice != null && p.listPrice !== '' ? String(p.listPrice) : '';

  const steps = p.installationSteps;
  if (Array.isArray(steps)) {
    p.installationSteps = steps.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof steps === 'string' && steps.trim()) {
    p.installationSteps = steps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    p.installationSteps = [];
  }

  p.wiringDiagramUrl =
    p.wiringDiagramUrl && String(p.wiringDiagramUrl).trim()
      ? String(p.wiringDiagramUrl).trim()
      : '';

  const dim = p.dimensions && typeof p.dimensions === 'object' ? p.dimensions : {};
  p.dimensions = {
    widthMm: Number(dim.widthMm) || 0,
    heightMm: Number(dim.heightMm) || 0,
    depthMm: Number(dim.depthMm) || 0,
  };
  p.weightG = Number(p.weightG) || 0;

  delete p.tier;
  delete p.category;
  delete p.segment;
  delete p.mechanicalMount;
  delete p.electricalNeutral;
  delete p.whiteLabelBrand;
  delete p.softwareFeature;
  delete p.technicalSpecs;
  delete p.tierAttributes;
  delete p.pcbaId;
  delete p.firmwareId;
  delete p.hardwareVersion;

  return p;
}

export function buildSalesPayload(body, existing = null) {
  const merged = {
    commercialSku: body.commercialSku?.trim() ?? existing?.commercialSku,
    name: body.name?.trim() ?? existing?.name,
    systemRole: body.systemRole ?? existing?.systemRole,
    productCategory: body.productCategory ?? existing?.productCategory,
    region: body.region ?? existing?.region ?? 'GLOBAL',
    protocol: body.protocol ?? existing?.protocol ?? 'ZIGBEE_3',
    lifecycle: body.lifecycle ?? existing?.lifecycle ?? 'RND',
    imageUrl: body.imageUrl ?? existing?.imageUrl,
    salesSpecs: body.salesSpecs ?? existing?.salesSpecs,
    listPrice: body.listPrice ?? existing?.listPrice ?? '',
    description: body.description ?? existing?.description ?? '',
    installationSteps: body.installationSteps ?? existing?.installationSteps ?? [],
    wiringDiagramUrl: body.wiringDiagramUrl ?? existing?.wiringDiagramUrl ?? '',
    dimensions: body.dimensions ?? existing?.dimensions ?? { widthMm: 0, heightMm: 0, depthMm: 0 },
    weightG: body.weightG ?? existing?.weightG ?? 0,
    activationRate: body.activationRate ?? existing?.activationRate ?? 80,
    offlineRate: body.offlineRate ?? existing?.offlineRate ?? 3,
    predecessorId:
      body.predecessorId !== undefined ? body.predecessorId : existing?.predecessorId ?? null,
  };

  return normalizeSalesProduct(merged);
}

export function migrateProductsToSales(products) {
  return products.map((p) => normalizeSalesProduct(p));
}
