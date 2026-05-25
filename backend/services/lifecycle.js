/** Sales catalog: lifecycle changes are always allowed (no state machine lock). */

export function validateLifecycleTransition(_product, _newLifecycle) {
  return { ok: true };
}

export function getLifecycleStats(products) {
  const stats = { RND: 0, CASH_COW: 0, LEGACY: 0, DEPRECATED: 0 };
  for (const p of products) {
    if (stats[p.lifecycle] !== undefined) stats[p.lifecycle]++;
  }
  return stats;
}
