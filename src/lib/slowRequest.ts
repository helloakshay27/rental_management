import { toast } from 'sonner';

const SLOW_REQUEST_MS = 8000;
const TOAST_ID = 'slow-network-request';
const slowRequests = new Set<symbol>();

type NetworkConnection = EventTarget & { effectiveType?: string; downlink?: number };

function networkConnection(): NetworkConnection | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as Navigator & { connection?: NetworkConnection }).connection;
}

// Request duration alone cannot distinguish a slow server from slow internet.
// Require the browser's network estimate; missing/unknown data means no warning.
function hasSlowNetwork(): boolean {
  if (typeof navigator === 'undefined' || navigator.onLine === false) return false;
  const connection = networkConnection();
  if (!connection) return false;
  const slowType = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  const lowBandwidth = typeof connection.downlink === 'number' && connection.downlink > 0 && connection.downlink < 0.5;
  return slowType && lowBandwidth;
}

/** Track only app API requests; never cancel or retry the actual operation. */
export function beginSlowRequest(): () => void {
  const request = Symbol();
  const connection = networkConnection();
  let elapsed = false;
  const clearWarning = () => {
    if (slowRequests.delete(request) && slowRequests.size === 0) toast.dismiss(TOAST_ID);
  };
  const update = () => {
    if (!elapsed) return;
    if (!hasSlowNetwork()) {
      clearWarning();
      return;
    }
    const first = slowRequests.size === 0;
    slowRequests.add(request);
    if (first) {
      toast.warning('Your internet connection is slow', {
        id: TOAST_ID,
        description: "This is taking longer than usual. It's still loading, no need to refresh.",
        duration: Infinity,
        closeButton: true,
      });
    }
  };
  const timer = setTimeout(() => { elapsed = true; update(); }, SLOW_REQUEST_MS);
  connection?.addEventListener('change', update);
  if (typeof window !== 'undefined') {
    window.addEventListener('offline', update);
    window.addEventListener('online', update);
  }

  return () => {
    clearTimeout(timer);
    connection?.removeEventListener('change', update);
    if (typeof window !== 'undefined') {
      window.removeEventListener('offline', update);
      window.removeEventListener('online', update);
    }
    clearWarning();
  };
}

export function fetchWithSlowWarning(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
export function fetchWithSlowWarning<T>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  consume: (response: Response) => Promise<T>,
): Promise<T>;
/** Include body consumption so slow downloads stay tracked after headers arrive. */
export async function fetchWithSlowWarning<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  consume?: (response: Response) => Promise<T>,
): Promise<Response | T> {
  const finish = beginSlowRequest();
  try {
    const response = await fetch(input, init);
    return consume ? await consume(response) : response;
  } finally {
    finish();
  }
}
