// Helper to filter only products available for purchase (not sold, not currently reserved)
export function applyAvailable<T extends { eq: Function; or: Function }>(q: T): T {
  const nowIso = new Date().toISOString();
  return q.eq("sold", false).or(`reserved_until.is.null,reserved_until.lt.${nowIso}`);
}
