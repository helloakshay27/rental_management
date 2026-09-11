/**
 * PWA registration helpers — adapted from fm-matrix-revamp's `src/utils/pwa.ts`.
 *
 * The reference registers only on a couple of routes; here the whole app is installable,
 * so registration is unconditional. The worker itself (public/service-worker.js) caches the
 * shell and build assets only — never API responses.
 */

export const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  // The dev server serves modules that must not be cached; registering there also keeps a
  // stale worker alive across restarts. Install only from a real build.
  if (import.meta.env.DEV) {
    const existing = await navigator.serviceWorker.getRegistrations();
    await Promise.all(existing.map((registration) => registration.unregister()));
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        // A new worker is ready and an old one is in control: take the update now rather
        // than leaving the tab on a build whose hashed chunks may already be gone.
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          installing.postMessage('SKIP_WAITING');
          window.location.reload();
        }
      });
    });
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
};

/** Clears every cache this origin holds — the escape hatch when a bad build gets pinned. */
export const clearAllCaches = async (): Promise<void> => {
  if (!('caches' in window)) return;
  const names = await caches.keys();
  await Promise.all(names.map((name) => caches.delete(name)));
};

/** True when running as an installed app rather than a browser tab. */
export const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

let deferredPrompt: (Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }) | null =
  null;

/**
 * Captures the browser's install prompt so the app can offer it at a sensible moment
 * instead of Chrome's default (which it suppresses once preventDefault is called).
 */
export const capturePWAInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as typeof deferredPrompt;
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });
};

export const canPromptPWAInstall = (): boolean => deferredPrompt !== null;

/** Shows the install prompt; resolves with the user's choice, or null if none was pending. */
export const promptPWAInstall = async (): Promise<string | null> => {
  if (!deferredPrompt) return null;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome;
};
