import posthog from 'posthog-js';
import { POSTHOG_HOST, POSTHOG_TOKEN } from '@/config/posthog';
import { getPostHogSuperProperties, getStoredUser } from '@/utils/posthogContext';
import { identifyPostHogUser } from '@/utils/posthogHelpers';
import { attachPostHogDebugLogger } from '@/utils/posthogDebug';
import { installDownloadTracking } from '@/utils/downloadTracking';
import { installDeclarativeAutoCapture } from '@/utils/posthogEvents';

/**
 * The PostHog client and everything that has to happen once, in one place.
 *
 * `main.tsx` calls `initPostHog()` before React renders — a capture inside a mount effect
 * must never run against an uninitialised client, which is what happens if the SDK is
 * configured through `PostHogProvider`'s apiKey prop (that inits inside a useEffect, after
 * the first render, and those early events are silently dropped).
 */

/**
 * PostHog's automatic events are ON alongside this app's own instrumentation.
 *
 *   $pageview / $pageleave  — SDK-captured on every history change, so PostHog's built-in
 *                             Web Analytics (sessions, paths, bounce, time on page) works.
 *   $autocapture            — every click/input, for exploratory questions nobody wired an
 *                             event for.
 *
 * Session recording, surveys and feature flags are OFF: all three are armed by the
 * remote-config response (`/array/<token>/config`), and that request is disabled.
 *
 * The deliberate events (`Utilities Page Viewed`, `Rental Created`, …) still come from this
 * app's helpers, so a navigation now shows BOTH `$pageview` and the named event in the
 * activity feed — that is the cost of having the built-in products working.
 */
const INIT_OPTIONS = {
  api_host: POSTHOG_HOST,
  autocapture: true,
  // 'history_change' is the SPA-correct value: a plain `true` only reports the first load.
  capture_pageview: 'history_change',
  capture_pageleave: true,
  // No remote config: the SDK never requests `/array/<token>/config` (nor `/flags`).
  // Session recording and surveys are switched off with it — both are gated on that
  // response and would never arm themselves anyway.
  advanced_disable_flags: true,
  disable_session_recording: true,
  disable_surveys: true,
  disable_toolbar: true,
} as const;

/** False when no project token is configured — every capture would be dropped silently. */
export const isPostHogConfigured = Boolean(
  POSTHOG_TOKEN && POSTHOG_TOKEN !== 'phc_replace_me' && !POSTHOG_TOKEN.startsWith('__')
);

let initialised = false;

export function initPostHog(): typeof posthog {
  if (initialised) return posthog;
  initialised = true;

  // posthog.init(undefined) does not throw — it returns a client that drops every capture.
  // That failure mode is indistinguishable from "the instrumentation is broken", so say so.
  if (!isPostHogConfigured) {
    console.error(
      '[PostHog] No project token — analytics is DISABLED and every event will be dropped. ' +
        'Set DEFAULT_POSTHOG_TOKEN in src/config/posthog.ts (or VITE_POSTHOG_PROJECT_TOKEN ' +
        'in .env) and restart the dev server.'
    );
    return posthog;
  }

  posthog.init(POSTHOG_TOKEN, INIT_OPTIONS);

  // Global context on every event: client, is_test, platform, release, role, company.
  posthog.register(getPostHogSuperProperties());

  // A reloaded tab still holds a session: re-assert the person so its events are not
  // attributed to a fresh anonymous id.
  identifyPostHogUser(getStoredUser());

  // QA console: one line per captured event, warning when required context is missing.
  attachPostHogDebugLogger(posthog);

  // Catch-all for file downloads no call site reports explicitly.
  installDownloadTracking(posthog);

  // data-ph-* buttons report themselves through one document-level listener.
  installDeclarativeAutoCapture();

  return posthog;
}

export { posthog };
