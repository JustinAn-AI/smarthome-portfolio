/** Ma trận 3 chiều — Smart Home Portfolio */

export const PRODUCT_TIERS = ['HUB', 'ACTUATOR', 'SENSOR', 'STANDALONE'];
export const PROTOCOLS = ['ZIGBEE_3', 'BLE', 'WIFI', 'THREAD', 'MATTER'];
export const LIFECYCLE_STATUSES = ['RND', 'CASH_COW', 'LEGACY', 'DEPRECATED'];
export const REGIONS = ['MAINLAND_CHINA', 'GLOBAL', 'EU', 'US', 'VN'];
export const ACTIVATION_SERVERS = ['GLOBAL', 'CHINA', 'EU', 'US', 'VN'];

/** Chiều ngang — Phân khúc */
export const SEGMENTS = ['BASIC', 'MID_ECOSYSTEM', 'PREMIUM_FLAGSHIP'];

/** Chiều dọc — Hạ tầng cơ khí */
export const MECHANICAL_MOUNTS = ['SQUARE_UK_VN', 'RECT_US', 'ROUND_EU'];

/** Chiều dọc — Hạ tầng điện */
export const ELECTRICAL_NEUTRAL_TYPES = ['WITH_NEUTRAL', 'NO_NEUTRAL'];

/** Chiều sâu — Phần mềm */
export const SOFTWARE_FEATURES = ['SUBSCRIPTION', 'FREE'];

export const MOUNT_STANDARDS = ['SQUARE', 'RECTANGLE'];
export const POWER_TYPES = ['NEUTRAL', 'NO_NEUTRAL'];

export const TIER_LABELS = {
  HUB: 'Tầng Trung tâm (Hubs/Gateways)',
  ACTUATOR: 'Tầng Thực thi (Actuators/Controllers)',
  SENSOR: 'Tầng Thu thập (Sensors)',
  STANDALONE: 'Tầng Độc lập (Standalone)',
};

export const SEGMENT_LABELS = {
  BASIC: 'Cơ bản (Wi-Fi/BLE, no hub)',
  MID_ECOSYSTEM: 'Trung cấp (Ecosystem Core — Zigbee/Thread)',
  PREMIUM_FLAGSHIP: 'Cao cấp (Flagship — AI Edge/Premium Panel)',
};

export const MECHANICAL_LABELS = {
  SQUARE_UK_VN: 'Đế Vuông UK/VN',
  RECT_US: 'Đế Chữ Nhật US',
  ROUND_EU: 'Đế Tròn EU',
};

export const ELECTRICAL_LABELS = {
  WITH_NEUTRAL: 'Có dây nguội (With Neutral)',
  NO_NEUTRAL: 'Không dây nguội (No Neutral)',
};

export const SOFTWARE_LABELS = {
  SUBSCRIPTION: 'Thu phí (Subscription)',
  FREE: 'Miễn phí (Free)',
};

export const REGION_LABELS = {
  MAINLAND_CHINA: 'Mainland China',
  GLOBAL: 'Global',
  EU: 'EU',
  US: 'US',
  VN: 'Vietnam',
};

export const PROTOCOL_LABELS = {
  ZIGBEE_3: 'Zigbee 3.0',
  BLE: 'BLE',
  WIFI: 'Wi-Fi',
  THREAD: 'Thread',
  MATTER: 'Matter',
};

export const LIFECYCLE_LABELS = {
  RND: 'R&D',
  CASH_COW: 'Cash Cow',
  LEGACY: 'Legacy',
  DEPRECATED: 'Deprecated',
};

export const TIER_ATTRIBUTE_SCHEMAS = {
  HUB: {
    required: ['maxDeviceLoad', 'ramMb', 'cpuMhz'],
    fields: {
      maxDeviceLoad: { type: 'number', min: 1 },
      ramMb: { type: 'number', min: 32 },
      cpuMhz: { type: 'number', min: 100 },
    },
  },
  ACTUATOR: {
    required: ['channels'],
    fields: {
      mountStandard: { type: 'enum', values: MOUNT_STANDARDS, optional: true },
      powerType: { type: 'enum', values: POWER_TYPES, optional: true },
      channels: { type: 'number', min: 1, max: 4 },
    },
  },
  SENSOR: {
    required: ['batteryType', 'powerConsumptionLevel'],
    fields: {
      batteryType: { type: 'string' },
      powerConsumptionLevel: { type: 'enum', values: ['LOW', 'MEDIUM', 'HIGH'] },
      sensorTypes: { type: 'array', optional: true },
    },
  },
  STANDALONE: {
    required: ['connectivity', 'hasAi'],
    fields: {
      connectivity: { type: 'array' },
      hasAi: { type: 'boolean' },
      resolution: { type: 'string', optional: true },
      storageGb: { type: 'number', optional: true },
    },
  },
};

export function inferSegment(p) {
  if (p.protocol === 'MATTER' || p.tier === 'HUB') {
    if (p.tierAttributes?.hasAi || (p.tierAttributes?.ramMb ?? 0) >= 512) return 'PREMIUM_FLAGSHIP';
  }
  if (['ZIGBEE_3', 'THREAD'].includes(p.protocol) && p.tier !== 'STANDALONE') {
    return 'MID_ECOSYSTEM';
  }
  if (p.protocol === 'WIFI' || p.protocol === 'BLE') return 'BASIC';
  return 'MID_ECOSYSTEM';
}

export function inferMechanicalMount(p) {
  if (p.region === 'EU') return 'ROUND_EU';
  if (p.region === 'US') return 'RECT_US';
  const ms = p.tierAttributes?.mountStandard;
  if (ms === 'RECTANGLE') return 'RECT_US';
  return 'SQUARE_UK_VN';
}

export function inferElectricalNeutral(p) {
  const pt = p.tierAttributes?.powerType;
  return pt === 'NO_NEUTRAL' ? 'NO_NEUTRAL' : 'WITH_NEUTRAL';
}

export function getMetaEnums() {
  return {
    tiers: PRODUCT_TIERS.map((v) => ({ value: v, label: TIER_LABELS[v] })),
    segments: SEGMENTS.map((v) => ({ value: v, label: SEGMENT_LABELS[v] })),
    mechanicalMounts: MECHANICAL_MOUNTS.map((v) => ({ value: v, label: MECHANICAL_LABELS[v] })),
    electricalNeutral: ELECTRICAL_NEUTRAL_TYPES.map((v) => ({
      value: v,
      label: ELECTRICAL_LABELS[v],
    })),
    softwareFeatures: SOFTWARE_FEATURES.map((v) => ({ value: v, label: SOFTWARE_LABELS[v] })),
    protocols: PROTOCOLS.map((v) => ({ value: v, label: PROTOCOL_LABELS[v] })),
    regions: REGIONS.map((v) => ({ value: v, label: REGION_LABELS[v] })),
    lifecycles: LIFECYCLE_STATUSES.map((v) => ({ value: v, label: LIFECYCLE_LABELS[v] })),
    labels: {
      tier: TIER_LABELS,
      segment: SEGMENT_LABELS,
      mechanicalMount: MECHANICAL_LABELS,
      electricalNeutral: ELECTRICAL_LABELS,
      softwareFeature: SOFTWARE_LABELS,
      region: REGION_LABELS,
      protocol: PROTOCOL_LABELS,
      lifecycle: LIFECYCLE_LABELS,
    },
    lifecycleColors: {
      RND: 'violet',
      CASH_COW: 'emerald',
      LEGACY: 'amber',
      DEPRECATED: 'red',
    },
    tierColors: {
      HUB: 'blue',
      ACTUATOR: 'orange',
      SENSOR: 'teal',
      STANDALONE: 'pink',
    },
  };
}

export function createProductTemplate(tier = 'ACTUATOR') {
  const base = {
    commercialSku: '',
    name: '',
    tier,
    region: 'GLOBAL',
    protocol: 'ZIGBEE_3',
    lifecycle: 'RND',
    segment: 'MID_ECOSYSTEM',
    mechanicalMount: 'SQUARE_UK_VN',
    electricalNeutral: 'WITH_NEUTRAL',
    whiteLabelBrand: 'SmartHome OEM',
    softwareFeature: 'FREE',
    activationRate: 85,
    offlineRate: 2.5,
    pcbaId: null,
    firmwareId: '',
    hardwareVersion: 'v1.0',
    tierAttributes: {},
    description: '',
  };

  switch (tier) {
    case 'HUB':
      base.segment = 'PREMIUM_FLAGSHIP';
      base.protocol = 'MATTER';
      base.tierAttributes = { maxDeviceLoad: 128, ramMb: 256, cpuMhz: 1200 };
      break;
    case 'ACTUATOR':
      base.tierAttributes = { channels: 1 };
      break;
    case 'SENSOR':
      base.tierAttributes = {
        batteryType: 'CR2032',
        powerConsumptionLevel: 'LOW',
        sensorTypes: ['motion'],
      };
      break;
    case 'STANDALONE':
      base.segment = 'BASIC';
      base.protocol = 'WIFI';
      base.tierAttributes = { connectivity: ['WIFI'], hasAi: false };
      break;
    default:
      break;
  }
  return base;
}
