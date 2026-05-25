import {
  SYSTEM_ROLES,
  PRODUCT_CATEGORIES,
  LIFECYCLE_STATUSES,
  REGIONS,
  PROTOCOLS,
} from './salesCatalog.js';

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.details = details;
  }
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

export function validateProductInput(body, { isUpdate = false, existing = null } = {}) {
  const errors = [];

  if (!isUpdate) {
    if (!SYSTEM_ROLES.includes(body.systemRole)) {
      errors.push(`systemRole must be one of: ${SYSTEM_ROLES.join(', ')}`);
    }
    if (!PRODUCT_CATEGORIES.includes(body.productCategory)) {
      errors.push(`productCategory must be one of: ${PRODUCT_CATEGORIES.join(', ')}`);
    }
  } else {
    if (body.systemRole && !SYSTEM_ROLES.includes(body.systemRole)) {
      errors.push('systemRole invalid');
    }
    if (body.productCategory && !PRODUCT_CATEGORIES.includes(body.productCategory)) {
      errors.push('productCategory invalid');
    }
  }

  if (body.commercialSku !== undefined && !isNonEmptyString(body.commercialSku)) {
    errors.push('commercialSku is required');
  }
  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    errors.push('name is required');
  }
  if (body.region !== undefined && !REGIONS.includes(body.region)) {
    errors.push('region invalid');
  }
  if (body.protocol !== undefined && !PROTOCOLS.includes(body.protocol)) {
    errors.push('protocol invalid');
  }
  if (body.lifecycle !== undefined && !LIFECYCLE_STATUSES.includes(body.lifecycle)) {
    errors.push('lifecycle invalid');
  }
  if (body.activationRate !== undefined) {
    const n = Number(body.activationRate);
    if (Number.isNaN(n) || n < 0 || n > 100) errors.push('activationRate must be 0-100');
  }
  if (body.offlineRate !== undefined) {
    const n = Number(body.offlineRate);
    if (Number.isNaN(n) || n < 0 || n > 100) errors.push('offlineRate must be 0-100');
  }

  if (errors.length) throw new ValidationError('Invalid product', errors);
  return true;
}

export function validateSerialInput(body) {
  const errors = [];
  if (!isNonEmptyString(body.serialNumber)) errors.push('serialNumber is required');
  if (!isNonEmptyString(body.skuId)) errors.push('skuId is required');
  if (errors.length) throw new ValidationError('Invalid serial', errors);
  return true;
}

export function validateActivationRequest({ serialNumber, activationServer }) {
  const errors = [];
  if (!isNonEmptyString(serialNumber)) errors.push('serialNumber is required');
  if (!['GLOBAL', 'CHINA', 'EU', 'US', 'VN'].includes(activationServer)) {
    errors.push('activationServer invalid');
  }
  if (errors.length) throw new ValidationError('Invalid request', errors);
  return true;
}

export function validateSuccessorLink(predecessor, successor) {
  if (!predecessor || !successor) {
    throw new ValidationError('Both products must exist');
  }
  if (predecessor.id === successor.id) {
    throw new ValidationError('Cannot link product to itself');
  }
  return true;
}
