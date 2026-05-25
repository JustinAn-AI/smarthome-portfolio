/** Phân loại danh mục chuyên sâu theo tầng + thông số kỹ thuật động */

export const CATEGORY_TREE = {
  HUB: [
    { value: 'HUB_GATEWAY', label: 'Hub/Gateway' },
    { value: 'HUB_SMART_PANEL', label: 'Smart Panel' },
    { value: 'HUB_REPEATER', label: 'Repeater' },
  ],
  ACTUATOR: [
    { value: 'ACT_SWITCH', label: 'Công tắc (Switch)' },
    { value: 'ACT_SOCKET', label: 'Ổ cắm (Socket)' },
    { value: 'ACT_LIGHTING', label: 'Chiếu sáng (Lighting)' },
    { value: 'ACT_CURTAIN', label: 'Động cơ rèm (Curtain Motor)' },
    { value: 'ACT_RELAY', label: 'Bộ điều khiển Rơ-le (Relay Module)' },
  ],
  SENSOR: [
    { value: 'SNS_ENVIRONMENT', label: 'Cảm biến Môi trường (Temp/Humi/Gas)' },
    { value: 'SNS_SECURITY', label: 'Cảm biến An ninh (Motion/Door/Water)' },
    { value: 'SNS_PRESENCE', label: 'Cảm biến Hiện diện (Presence/Radar)' },
  ],
  STANDALONE: [
    { value: 'STD_CAMERA', label: 'Camera an ninh' },
    { value: 'STD_LOCK', label: 'Khóa thông minh' },
    { value: 'STD_APPLIANCE', label: 'Thiết bị độc lập khác' },
  ],
};

export const CATEGORY_LABELS = Object.fromEntries(
  Object.values(CATEGORY_TREE)
    .flat()
    .map((c) => [c.value, c.label])
);

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS);

export const POWER_PORT_OPTIONS = [
  { value: 'TYPE_C', label: 'USB Type-C' },
  { value: 'MICRO_USB', label: 'Micro USB' },
  { value: 'POE', label: 'PoE' },
  { value: 'DC_BARREL', label: 'DC Barrel' },
];

/** Định nghĩa trường form / validate theo danh mục */
export const TECH_SPEC_FIELDS = {
  HUB_GATEWAY: [
    { key: 'maxChildDevices', label: 'Số thiết bị con tối đa', type: 'number', unit: 'devices' },
    { key: 'powerPortType', label: 'Loại cổng nguồn', type: 'select', options: POWER_PORT_OPTIONS },
    { key: 'ethernetPort', label: 'Cổng Ethernet', type: 'boolean' },
  ],
  HUB_SMART_PANEL: [
    { key: 'maxChildDevices', label: 'Số thiết bị con tối đa', type: 'number', unit: 'devices' },
    { key: 'powerPortType', label: 'Loại cổng nguồn', type: 'select', options: POWER_PORT_OPTIONS },
    { key: 'screenInches', label: 'Kích thước màn hình', type: 'number', unit: 'inch' },
  ],
  HUB_REPEATER: [
    { key: 'maxChildDevices', label: 'Số thiết bị relay', type: 'number', unit: 'devices' },
    { key: 'powerPortType', label: 'Loại cổng nguồn', type: 'select', options: POWER_PORT_OPTIONS },
  ],
  ACT_SWITCH: [
    { key: 'maxLoadW', label: 'Công suất tải tối đa', type: 'number', unit: 'W' },
    { key: 'voltageV', label: 'Điện áp', type: 'number', unit: 'V' },
    { key: 'channels', label: 'Số kênh', type: 'number' },
  ],
  ACT_SOCKET: [
    { key: 'maxLoadW', label: 'Công suất tải tối đa', type: 'number', unit: 'W' },
    { key: 'voltageV', label: 'Điện áp', type: 'number', unit: 'V' },
    { key: 'usbPorts', label: 'Cổng USB', type: 'number' },
  ],
  ACT_LIGHTING: [
    { key: 'lumens', label: 'Độ sáng (Lumens)', type: 'number', unit: 'lm' },
    { key: 'cctMinK', label: 'CCT tối thiểu', type: 'number', unit: 'K' },
    { key: 'cctMaxK', label: 'CCT tối đa', type: 'number', unit: 'K' },
    { key: 'wattageW', label: 'Công suất', type: 'number', unit: 'W' },
  ],
  ACT_CURTAIN: [
    { key: 'maxLoadKg', label: 'Tải trọng tối đa', type: 'number', unit: 'kg' },
    { key: 'voltageV', label: 'Điện áp', type: 'number', unit: 'V' },
    { key: 'trackLengthM', label: 'Chiều dài ray', type: 'number', unit: 'm' },
  ],
  ACT_RELAY: [
    { key: 'maxLoadW', label: 'Công suất tải tối đa', type: 'number', unit: 'W' },
    { key: 'voltageV', label: 'Điện áp', type: 'number', unit: 'V' },
    { key: 'channels', label: 'Số kênh rơ-le', type: 'number' },
  ],
  SNS_ENVIRONMENT: [
    { key: 'batteryType', label: 'Loại pin', type: 'text' },
    { key: 'batteryLifeMonths', label: 'Tuổi thọ pin', type: 'number', unit: 'tháng' },
    { key: 'tempRangeC', label: 'Dải nhiệt độ', type: 'text' },
    { key: 'humidityRange', label: 'Dải độ ẩm', type: 'text' },
  ],
  SNS_SECURITY: [
    { key: 'batteryType', label: 'Loại pin', type: 'text' },
    { key: 'batteryLifeMonths', label: 'Tuổi thọ pin', type: 'number', unit: 'tháng' },
    { key: 'detectionRangeM', label: 'Tầm phát hiện', type: 'number', unit: 'm' },
  ],
  SNS_PRESENCE: [
    { key: 'batteryType', label: 'Loại pin / nguồn', type: 'text' },
    { key: 'batteryLifeMonths', label: 'Tuổi thọ pin', type: 'number', unit: 'tháng' },
    { key: 'radarGHz', label: 'Radar', type: 'number', unit: 'GHz' },
  ],
  STD_CAMERA: [
    { key: 'resolution', label: 'Độ phân giải', type: 'text' },
    { key: 'fieldOfView', label: 'Góc nhìn', type: 'text' },
    { key: 'nightVision', label: 'Night vision', type: 'boolean' },
  ],
  STD_LOCK: [
    { key: 'batteryType', label: 'Loại pin', type: 'text' },
    { key: 'batteryLifeMonths', label: 'Tuổi thọ pin', type: 'number', unit: 'tháng' },
    { key: 'unlockMethods', label: 'Phương thức mở', type: 'text' },
  ],
  STD_APPLIANCE: [
    { key: 'maxLoadW', label: 'Công suất', type: 'number', unit: 'W' },
    { key: 'voltageV', label: 'Điện áp', type: 'number', unit: 'V' },
  ],
};

/** Ảnh mặc định Unsplash / placeholder theo danh mục */
export const DEFAULT_CATEGORY_IMAGES = {
  HUB_GATEWAY:
    'https://images.unsplash.com/photo-1558618666-fcd25c85f933?w=200&h=200&fit=crop',
  HUB_SMART_PANEL:
    'https://images.unsplash.com/photo-1558002038-105d7a3b0a26?w=200&h=200&fit=crop',
  HUB_REPEATER:
    'https://images.unsplash.com/photo-1544197150-99b262c3adab?w=200&h=200&fit=crop',
  ACT_SWITCH:
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
  ACT_SOCKET:
    'https://images.unsplash.com/photo-1584438784894-6d2e27e71d77?w=200&h=200&fit=crop',
  ACT_LIGHTING:
    'https://images.unsplash.com/photo-1565814636192-8452d1f7a4d0?w=200&h=200&fit=crop',
  ACT_CURTAIN:
    'https://images.unsplash.com/photo-1513694203232-719a280e0f1e?w=200&h=200&fit=crop',
  ACT_RELAY:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop',
  SNS_ENVIRONMENT:
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
  SNS_SECURITY:
    'https://images.unsplash.com/photo-1558002038-105d7a3b0a26?w=200&h=200&fit=crop',
  SNS_PRESENCE:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop',
  STD_CAMERA:
    'https://images.unsplash.com/photo-1557324232-974ad9c20d0f?w=200&h=200&fit=crop',
  STD_LOCK:
    'https://images.unsplash.com/photo-1558002038-105d7a3b0a26?w=200&h=200&fit=crop',
  STD_APPLIANCE:
    'https://images.unsplash.com/photo-1558618666-fcd25c85f933?w=200&h=200&fit=crop',
};

export function getCategoriesForTier(tier) {
  return CATEGORY_TREE[tier] || CATEGORY_TREE.ACTUATOR;
}

export function getDefaultSpecsForCategory(category) {
  const defaults = {
    HUB_GATEWAY: { maxChildDevices: 128, powerPortType: 'TYPE_C', ethernetPort: true },
    HUB_SMART_PANEL: { maxChildDevices: 64, powerPortType: 'POE', screenInches: 10.1 },
    HUB_REPEATER: { maxChildDevices: 32, powerPortType: 'MICRO_USB' },
    ACT_SWITCH: { maxLoadW: 800, voltageV: 220, channels: 1 },
    ACT_SOCKET: { maxLoadW: 2500, voltageV: 220, usbPorts: 0 },
    ACT_LIGHTING: { lumens: 800, cctMinK: 2700, cctMaxK: 6500, wattageW: 12 },
    ACT_CURTAIN: { maxLoadKg: 40, voltageV: 220, trackLengthM: 3 },
    ACT_RELAY: { maxLoadW: 3000, voltageV: 220, channels: 2 },
    SNS_ENVIRONMENT: {
      batteryType: 'CR2032',
      batteryLifeMonths: 12,
      tempRangeC: '-10~50°C',
      humidityRange: '0-99% RH',
    },
    SNS_SECURITY: { batteryType: 'CR2450', batteryLifeMonths: 18, detectionRangeM: 7 },
    SNS_PRESENCE: { batteryType: 'USB-C', batteryLifeMonths: 0, radarGHz: 24 },
    STD_CAMERA: { resolution: '2K', fieldOfView: '110°', nightVision: true },
    STD_LOCK: { batteryType: 'AA x8', batteryLifeMonths: 10, unlockMethods: 'App, PIN, Key' },
    STD_APPLIANCE: { maxLoadW: 2000, voltageV: 220 },
  };
  return { ...(defaults[category] || {}) };
}

export function getDefaultImageUrl(category) {
  return (
    DEFAULT_CATEGORY_IMAGES[category] ||
    'https://images.unsplash.com/photo-1558618666-fcd25c85f933?w=200&h=200&fit=crop'
  );
}

export function inferCategory(product) {
  if (product.category && ALL_CATEGORIES.includes(product.category)) {
    return product.category;
  }

  const tier = product.tier || 'ACTUATOR';
  const name = (product.name || '').toLowerCase();
  const sku = (product.commercialSku || '').toLowerCase();

  if (tier === 'HUB') {
    if (name.includes('panel')) return 'HUB_SMART_PANEL';
    if (name.includes('repeat')) return 'HUB_REPEATER';
    return 'HUB_GATEWAY';
  }
  if (tier === 'ACTUATOR') {
    if (name.includes('socket') || sku.includes('sock')) return 'ACT_SOCKET';
    if (name.includes('light') || name.includes('bulb')) return 'ACT_LIGHTING';
    if (name.includes('curtain')) return 'ACT_CURTAIN';
    if (name.includes('relay')) return 'ACT_RELAY';
    return 'ACT_SWITCH';
  }
  if (tier === 'SENSOR') {
    if (name.includes('presence') || name.includes('mmwave') || name.includes('radar')) {
      return 'SNS_PRESENCE';
    }
    if (name.includes('temp') || name.includes('humi') || name.includes('gas')) {
      return 'SNS_ENVIRONMENT';
    }
    return 'SNS_SECURITY';
  }
  if (tier === 'STANDALONE') {
    if (name.includes('cam')) return 'STD_CAMERA';
    if (name.includes('lock')) return 'STD_LOCK';
    return 'STD_APPLIANCE';
  }
  return getCategoriesForTier(tier)[0]?.value || 'ACT_SWITCH';
}

export function getCategoryMetaForApi() {
  return {
    categoryTree: CATEGORY_TREE,
    categoryLabels: CATEGORY_LABELS,
    techSpecFields: TECH_SPEC_FIELDS,
    defaultImages: DEFAULT_CATEGORY_IMAGES,
    powerPortOptions: POWER_PORT_OPTIONS,
  };
}
