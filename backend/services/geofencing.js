import { REGION_LABELS } from '../models/schemas.js';

/**
 * Maps product/serial region to allowed activation servers.
 * MAINLAND_CHINA serials must only activate on CHINA server.
 */
const REGION_TO_SERVER = {
  MAINLAND_CHINA: 'CHINA',
  GLOBAL: 'GLOBAL',
  EU: 'EU',
  US: 'US',
  VN: 'VN',
};

const SERVER_LABELS = {
  GLOBAL: 'Global Server',
  CHINA: 'China Server',
  EU: 'EU Server',
  US: 'US Server',
  VN: 'VN Server',
};

/**
 * Evaluates whether a serial may activate on the requested server.
 * @returns {{ allowed: boolean, blocked: boolean, reason: string | null, expectedServer: string }}
 */
export function evaluateGeofence({ serialRegion, activationServer, serialNumber }) {
  const expectedServer = REGION_TO_SERVER[serialRegion] ?? 'GLOBAL';

  if (serialRegion === 'MAINLAND_CHINA' && activationServer === 'GLOBAL') {
    return {
      allowed: false,
      blocked: true,
      expectedServer,
      reason: `GEOFENCE_BLOCK: Serial ${serialNumber} (region ${REGION_LABELS.MAINLAND_CHINA}) attempted activation on ${SERVER_LABELS.GLOBAL}. Auto-blocked per China export policy.`,
    };
  }

  if (serialRegion === 'MAINLAND_CHINA' && activationServer !== 'CHINA') {
    return {
      allowed: false,
      blocked: true,
      expectedServer,
      reason: `GEOFENCE_BLOCK: China-region serial must use ${SERVER_LABELS.CHINA}, not ${SERVER_LABELS[activationServer] || activationServer}.`,
    };
  }

  if (expectedServer !== activationServer) {
    return {
      allowed: false,
      blocked: true,
      expectedServer,
      reason: `GEOFENCE_BLOCK: Serial region ${REGION_LABELS[serialRegion] || serialRegion} requires ${SERVER_LABELS[expectedServer] || expectedServer}.`,
    };
  }

  return {
    allowed: true,
    blocked: false,
    expectedServer,
    reason: null,
  };
}

export function getRegionForServer(server) {
  const entry = Object.entries(REGION_TO_SERVER).find(([, s]) => s === server);
  return entry ? entry[0] : 'GLOBAL';
}
