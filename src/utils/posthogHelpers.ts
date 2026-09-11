import posthog from 'posthog-js';
import { getStoredUser, normalizeRoute, resolveModule } from './posthogContext';

/**
 * The one place an event is actually captured.
 *
 * Every module helper in `hooks/usePostHogEvents.ts` funnels through here, so the identity
 * context (user, company, module, screen) is attached in a single place instead of being
 * re-derived — and forgotten — at ~100 call sites. Ported from fm-matrix-revamp's
 * `utils/posthogHelpers.ts`.
 */

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? 'dev';

/** Identifies this product inside the shared PostHog project. */
export const PROJECT_ID = 'P-RENT';
export const PROJECT_CODE = 'RENT-01';

function numeric(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export const capturePostHogEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  // Analytics must never be able to break a user action.
  try {
    const user = getStoredUser();

    posthog.capture(event, {
      project_id: PROJECT_ID,
      project_code: PROJECT_CODE,
      platform: 'web',
      release_version: RELEASE_VERSION,
      module: resolveModule(),
      screen: normalizeRoute(),
      user_id: numeric(user?.id),
      email: user?.email ?? undefined,
      company_id: numeric(user?.company_id ?? localStorage.getItem('selectedCompanyId')),
      company_name: user?.company_name ?? localStorage.getItem('selectedCompany') ?? undefined,
      site_id: numeric(user?.site_id ?? localStorage.getItem('selectedSiteId')),
      site_name: user?.site_name ?? localStorage.getItem('selectedSiteName') ?? undefined,
      ...props,
    });
  } catch (err) {
    console.warn('[analytics] capture failed', err);
  }
};

/**
 * Identify the signed-in user. Called from the login flow and re-asserted on app start so a
 * reloaded session keeps its person profile.
 */
export const identifyPostHogUser = (user: Record<string, any> | null | undefined) => {
  if (!user?.id) return;
  try {
    const name =
      user.full_name ??
      [user.firstname, user.lastname].filter(Boolean).join(' ') ??
      undefined;

    posthog.identify(String(user.id), {
      email: user.email ?? undefined,
      name: name || undefined,
      user_name: name || undefined,
      contact_number: user.mobile ?? user.phone ?? undefined,
      user_type: user.user_type ?? undefined,
      user_role:
        user.lock_role?.name ??
        user.role?.name ??
        user.role ??
        (Array.isArray(user.roles) ? user.roles[0]?.name ?? user.roles[0] : undefined) ??
        undefined,
      company_name: user.company_name ?? user.company?.name ?? undefined,
      is_logged_in: true,
      // CAUTION: this means "has a @lockated.com address", i.e. Lockated's own staff. It is
      // NOT an internal-FTE vs external-contractor split.
      is_internal: typeof user.email === 'string' ? user.email.endsWith('@lockated.com') : false,
    });
  } catch (err) {
    console.warn('[analytics] identify failed', err);
  }
};

/** Drops the person association on logout so the next sign-in starts a clean profile. */
export const resetPostHogUser = () => {
  try {
    posthog.reset();
  } catch {
    /* posthog not initialised — nothing to reset */
  }
};
