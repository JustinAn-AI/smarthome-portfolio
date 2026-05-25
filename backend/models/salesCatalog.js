/** Sales / Marketing catalog — không chứa trường R&D (PCBA, firmware…) */

export const SYSTEM_ROLES = ['HUB_CENTRAL', 'PERIPHERAL_HUB', 'STANDALONE_CLOUD'];

export const PRODUCT_CATEGORIES = [
  'SWITCH',
  'SOCKET',
  'LIGHTING',
  'SENSOR',
  'CURTAIN',
  'SECURITY',
];

export const LIFECYCLE_STATUSES = ['RND', 'CASH_COW', 'LEGACY', 'DEPRECATED'];

export const REGIONS = ['MAINLAND_CHINA', 'GLOBAL', 'EU', 'US', 'VN'];

export const PROTOCOLS = ['ZIGBEE_3', 'BLE', 'WIFI', 'THREAD', 'MATTER'];

export const SYSTEM_ROLE_LABELS = {
  HUB_CENTRAL: 'Bộ trung tâm (Hub/Gateway)',
  PERIPHERAL_HUB: 'Thiết bị ngoại vi (Zigbee/Thread qua Hub)',
  STANDALONE_CLOUD: 'Thiết bị độc lập (Wi-Fi/Cloud trực tiếp)',
};

export const PRODUCT_CATEGORY_LABELS = {
  SWITCH: 'Công tắc (Switch)',
  SOCKET: 'Ổ cắm (Socket)',
  LIGHTING: 'Chiếu sáng (Lighting)',
  SENSOR: 'Cảm biến (Sensors)',
  CURTAIN: 'Động cơ rèm (Curtain)',
  SECURITY: 'Khóa & Camera (Security)',
};

export const LIFECYCLE_LABELS = {
  RND: 'Sắp ra mắt (R&D)',
  CASH_COW: 'Dòng sản phẩm chính (Bán chạy)',
  LEGACY: 'Mẫu cũ (Hạn chế bán)',
  DEPRECATED: 'Đã khai tử (Ngừng bán)',
};

export const REGION_LABELS = {
  MAINLAND_CHINA: 'Trung Quốc (Nội địa)',
  GLOBAL: 'Quốc tế (Global)',
  EU: 'Châu Âu (EU)',
  US: 'Hoa Kỳ (US)',
  VN: 'Việt Nam (VN)',
};

export const PROTOCOL_LABELS = {
  ZIGBEE_3: 'Zigbee 3.0',
  BLE: 'Bluetooth',
  WIFI: 'Wi-Fi',
  THREAD: 'Thread',
  MATTER: 'Matter',
};

export const NEUTRAL_WIRE_OPTIONS = [
  { value: 'WITH_NEUTRAL', label: 'Có dây nguội (N)' },
  { value: 'NO_NEUTRAL', label: 'Không dây nguội (No-N)' },
];

export const MOUNT_TYPE_OPTIONS = [
  { value: 'SQUARE', label: 'Đế vuông' },
  { value: 'RECTANGLE', label: 'Đế chữ nhật' },
];

export const COLOR_MODE_OPTIONS = [
  { value: 'RGB', label: 'RGB' },
  { value: 'CCT', label: 'CCT (2700K–6500K)' },
  { value: 'SINGLE', label: 'Đơn sắc' },
];

export const HUB_SALES_SPEC_FIELDS = [
  { key: 'maxChildDevices', label: 'Số thiết bị con tối đa', type: 'number', unit: 'devices' },
  { key: 'powerPort', label: 'Cổng nguồn', type: 'text' },
  { key: 'ethernet', label: 'Cổng Ethernet', type: 'boolean' },
];

/** Nhóm form thông số bán hàng theo chủng loại */
export const SALES_SPEC_FIELDS = {
  SWITCH: [
    { key: 'maxLoadW', label: 'Công suất chịu tải', type: 'number', unit: 'W' },
    { key: 'neutralWire', label: 'Cấu hình nguồn', type: 'select', options: NEUTRAL_WIRE_OPTIONS },
    { key: 'mountType', label: 'Loại đế âm', type: 'select', options: MOUNT_TYPE_OPTIONS },
    { key: 'channels', label: 'Số kênh', type: 'number' },
  ],
  SOCKET: [
    { key: 'maxLoadW', label: 'Công suất chịu tải', type: 'number', unit: 'W' },
    { key: 'neutralWire', label: 'Cấu hình nguồn', type: 'select', options: NEUTRAL_WIRE_OPTIONS },
    { key: 'mountType', label: 'Loại đế âm', type: 'select', options: MOUNT_TYPE_OPTIONS },
    { key: 'usbPorts', label: 'Cổng USB', type: 'number' },
  ],
  LIGHTING: [
    { key: 'lumens', label: 'Độ sáng', type: 'number', unit: 'lm' },
    { key: 'wattageW', label: 'Công suất', type: 'number', unit: 'W' },
    { key: 'colorMode', label: 'Đổi màu', type: 'select', options: COLOR_MODE_OPTIONS },
  ],
  SENSOR: [
    { key: 'batteryType', label: 'Loại pin', type: 'text' },
    { key: 'detectionRangeM', label: 'Khoảng cách quét', type: 'number', unit: 'm' },
    { key: 'sensorSubtype', label: 'Loại cảm biến', type: 'text' },
  ],
  CURTAIN: [
    { key: 'maxLoadKg', label: 'Tải trọng tối đa', type: 'number', unit: 'kg' },
    { key: 'trackLengthM', label: 'Chiều dài ray', type: 'number', unit: 'm' },
    { key: 'voltageV', label: 'Điện áp', type: 'number', unit: 'V' },
  ],
  SECURITY: [
    { key: 'resolution', label: 'Độ phân giải', type: 'text' },
    { key: 'connectivity', label: 'Kết nối', type: 'text' },
    { key: 'nightVision', label: 'Night vision', type: 'boolean' },
  ],
};

export const DEFAULT_CATEGORY_IMAGES = {
  SWITCH: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
  SOCKET: 'https://images.unsplash.com/photo-1584438784894-6d2e27e71d77?w=200&h=200&fit=crop',
  LIGHTING: 'https://images.unsplash.com/photo-1565814636192-8452d1f7a4d0?w=200&h=200&fit=crop',
  SENSOR: 'https://images.unsplash.com/photo-1558002038-105d7a3b0a26?w=200&h=200&fit=crop',
  CURTAIN: 'https://images.unsplash.com/photo-1513694203232-719a280e0f1e?w=200&h=200&fit=crop',
  SECURITY: 'https://images.unsplash.com/photo-1557324232-974ad9c20d0f?w=200&h=200&fit=crop',
  HUB_CENTRAL:
    'https://images.unsplash.com/photo-1558618666-fcd25c85f933?w=200&h=200&fit=crop',
};

export function getDefaultSalesSpecs(category) {
  const defaults = {
    SWITCH: { maxLoadW: 800, neutralWire: 'WITH_NEUTRAL', mountType: 'SQUARE', channels: 1 },
    SOCKET: { maxLoadW: 2500, neutralWire: 'WITH_NEUTRAL', mountType: 'RECTANGLE', usbPorts: 0 },
    LIGHTING: { lumens: 800, wattageW: 12, colorMode: 'CCT' },
    SENSOR: { batteryType: 'CR2032', detectionRangeM: 7, sensorSubtype: 'Motion' },
    CURTAIN: { maxLoadKg: 40, trackLengthM: 3, voltageV: 220 },
    SECURITY: { resolution: '2K', connectivity: 'Wi-Fi', nightVision: true },
  };
  return { ...(defaults[category] || {}) };
}

export function getDefaultImageUrl(category, systemRole) {
  if (systemRole === 'HUB_CENTRAL') return DEFAULT_CATEGORY_IMAGES.HUB_CENTRAL;
  return DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES.SWITCH;
}

export function displayCategoryLabel(product) {
  if (product.systemRole === 'HUB_CENTRAL') return 'Bộ trung tâm (Hub/Gateway)';
  return PRODUCT_CATEGORY_LABELS[product.productCategory] || product.productCategory;
}

export function getSalesMeta() {
  return {
    systemRoles: SYSTEM_ROLES.map((v) => ({ value: v, label: SYSTEM_ROLE_LABELS[v] })),
    productCategories: PRODUCT_CATEGORIES.map((v) => ({
      value: v,
      label: PRODUCT_CATEGORY_LABELS[v],
    })),
    lifecycles: LIFECYCLE_STATUSES.map((v) => ({ value: v, label: LIFECYCLE_LABELS[v] })),
    regions: REGIONS.map((v) => ({ value: v, label: REGION_LABELS[v] })),
    protocols: PROTOCOLS.map((v) => ({ value: v, label: PROTOCOL_LABELS[v] })),
    salesSpecFields: SALES_SPEC_FIELDS,
    hubSalesSpecFields: HUB_SALES_SPEC_FIELDS,
    defaultImages: DEFAULT_CATEGORY_IMAGES,
    labels: {
      systemRole: SYSTEM_ROLE_LABELS,
      productCategory: PRODUCT_CATEGORY_LABELS,
      lifecycle: LIFECYCLE_LABELS,
      region: REGION_LABELS,
      protocol: PROTOCOL_LABELS,
    },
    lifecycleColors: {
      RND: 'violet',
      CASH_COW: 'emerald',
      LEGACY: 'amber',
      DEPRECATED: 'red',
    },
  };
}
