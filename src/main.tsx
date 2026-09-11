import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import App from './App.tsx'
import './index.css'
import './styles/theme.css' // Lockated Brand Theme - edit this file for global color changes
import { getPostHogSuperProperties, getStoredUser } from './utils/posthogContext.ts'
import { attachPostHogDebugLogger } from './utils/posthogDebug.ts'
import { installDownloadTracking } from './utils/downloadTracking.ts'
import { identifyPostHogUser } from './utils/posthogHelpers.ts'
import { capturePWAInstallPrompt, registerServiceWorker } from './utils/pwa.ts'
import { POSTHOG_HOST, POSTHOG_TOKEN } from './config/posthog.ts'

// Initialise PostHog BEFORE React renders, so a capture() inside a mount effect is never
// made against an uninitialised instance. Passing apiKey + options to PostHogProvider would
// init inside a useEffect (after render) and those early events would be dropped.
const posthogToken = POSTHOG_TOKEN
const posthogHost = POSTHOG_HOST

// posthog.init(undefined) does not throw — it returns a client that silently drops every
// capture(). That failure mode is indistinguishable from "the instrumentation is broken",
// so say so loudly instead of guessing later.
if (!posthogToken || posthogToken === 'phc_replace_me' || posthogToken.startsWith('__')) {
  console.error(
    '[PostHog] No project token — analytics is DISABLED and every event will be dropped. ' +
      'Set DEFAULT_POSTHOG_TOKEN in src/config/posthog.ts (or VITE_POSTHOG_PROJECT_TOKEN ' +
      'in .env) and restart the dev server.'
  )
} else {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: false, // handled manually by PostHogPageView
    disable_session_recording: true,
  })

  // Mandatory query filters (client, is_test) plus platform/release context, stamped on
  // every event including $pageview. See utils/posthogContext.ts.
  posthog.register(getPostHogSuperProperties())

  // A reloaded tab still holds a session: re-assert the person so its events are not
  // attributed to a fresh anonymous id.
  identifyPostHogUser(getStoredUser())

  // One console line per captured event on the dev server, or anywhere with
  // localStorage.ph_debug = '1'.
  attachPostHogDebugLogger(posthog)

  // Catch-all for file downloads that no call site reports explicitly.
  installDownloadTracking(posthog)
}

// PWA: install prompt is captured before render; the worker registers in production only.
capturePWAInstallPrompt()
void registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
)
