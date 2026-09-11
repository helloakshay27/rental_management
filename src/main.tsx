import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import App from './App.tsx'
import './index.css'
import './styles/theme.css' // Lockated Brand Theme - edit this file for global color changes
import { initPostHog, posthog } from './lib/posthog.ts'

// Analytics is configured and started before React renders — see lib/posthog.ts for why.
initPostHog()

// The app briefly shipped a PWA service worker. A browser that installed it keeps serving
// the cached shell until something unregisters it, so clean up any leftover registration
// (and its caches) rather than leaving those users pinned to an old build.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((r) => r.unregister())))
    .then(() => ('caches' in window ? caches.keys() : []))
    .then((names) => Promise.all(names.map((name) => caches.delete(name))))
    .catch(() => {
      /* nothing to clean up */
    })
}

createRoot(document.getElementById('root')!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
)
