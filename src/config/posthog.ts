/**
 * PostHog connection settings.
 *
 * Kept in code rather than in a .env, the same way `API_BASE_URL` is in `lib/api.ts`:
 * a fresh clone reports analytics with no local setup step. A project token is a
 * publishable client key — Vite inlines it into the JS bundle either way, so keeping it
 * here changes nothing about its exposure; it grants permission to send events, never to
 * read them.
 *
 * An env var still wins where one is set, so a separate deployment (or a throwaway project
 * while debugging) can override it without a code change.
 */

/** Shared Lockated project; this app is separated from the others by the `client` property. */
const DEFAULT_POSTHOG_TOKEN = '__POSTHOG_TOKEN__';
const DEFAULT_POSTHOG_HOST = 'https://posthog.lockated.com';

export const POSTHOG_TOKEN =
  (import.meta.env.VITE_POSTHOG_PROJECT_TOKEN as string) || DEFAULT_POSTHOG_TOKEN;

export const POSTHOG_HOST =
  (import.meta.env.VITE_POSTHOG_HOST as string) || DEFAULT_POSTHOG_HOST;
