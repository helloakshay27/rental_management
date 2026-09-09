/**
 * Mobile UI gate for EnhancedTable (ported from fm-matrix-revamp).
 *
 * In the reference app this was a per-tenant host allow-list, because the mobile
 * card/list view of EnhancedTable had to stay off for some tenants. This app has
 * a single deployment, so the mobile view is simply enabled everywhere and the
 * table falls back to its card layout on small screens.
 *
 * The named export is kept identical so EnhancedTable.tsx stays a drop-in copy
 * of the reference component.
 */
export const isMobileUiSite = (): boolean => {
  if (typeof window === "undefined") return false;
  return true;
};
