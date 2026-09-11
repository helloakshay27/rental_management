import { resourceFromPath, trackApiWrite } from "@/utils/analytics";

/** Where requests go when the session has not stored a host of its own. */
export const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://rental-uat.lockated.com";

/**
 * The API host lives in localStorage next to the token, so a session can point at a
 * different backend without a rebuild — ported from fm-matrix-revamp's `saveBaseUrl` /
 * `getBaseUrl` in `utils/auth.ts`. It is stored WITHOUT the protocol, matching the
 * reference, so older code that prefixes `https://` itself cannot end up with `https://https://`.
 *
 * Nothing in the UI writes it yet; the login flow records the host it actually used, and a
 * host field on the login screen only has to call `saveBaseUrl()` for the rest of the app
 * to follow it.
 */
const BASE_URL_KEY = "baseUrl";

const stripProtocol = (url: string) => url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");

export function saveBaseUrl(baseUrl: string) {
  try {
    const domainOnly = stripProtocol(baseUrl.trim());
    if (domainOnly) localStorage.setItem(BASE_URL_KEY, domainOnly);
  } catch (e) {
    // storage unavailable — requests fall back to the default host
  }
}

/** The host every request should use, with protocol. Falls back to the build default. */
export function getBaseUrl(): string {
  try {
    const saved = localStorage.getItem(BASE_URL_KEY);
    if (saved) return saved.startsWith("http") ? saved : `https://${saved}`;
  } catch (e) {
    // ignore
  }
  return DEFAULT_API_BASE_URL;
}

/** Same value without the protocol, for code that adds `https://` itself. */
export function getBaseUrlDomain(): string {
  return stripProtocol(getBaseUrl());
}

export function clearBaseUrl() {
  try {
    localStorage.removeItem(BASE_URL_KEY);
  } catch (e) {
    // ignore
  }
}

/**
 * @deprecated Reads the build default only — it cannot see a host stored later in the
 * session. Call `getBaseUrl()` instead; kept so existing imports keep compiling.
 */
export const API_BASE_URL = DEFAULT_API_BASE_URL;

/**
 * A 401 means the stored token is no longer good (expired or revoked), so the
 * session is cleared here. The route guard then bounces the next navigation to
 * /login instead of leaving the user on a page whose requests all fail.
 */
const CREDENTIAL_PATHS = ["/auth/", "sign_in", "change_password", "reset_password"];

function handleUnauthorized(res: Response, path: string) {
  // A 401 from a credential endpoint means "wrong password", not "session
  // expired" — clearing the token there would log the user out mid-form.
  if (CREDENTIAL_PATHS.some((p) => path.includes(p))) return;

  if (res.status === 401) {
    clearToken();
    try {
      window.dispatchEvent(new Event("auth-changed"));
    } catch (e) {
      // ignore
    }
  }
}

export async function post(path: string, body: any) {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    handleUnauthorized(res, path);
    const message = data?.message || res.statusText || "Request failed";
    const err: any = new Error(message);
    err.response = data;
    throw err;
  }
  return data;
}

/**
 * Every write in this app goes through one of the four helpers below, so reporting here
 * covers screens nobody instrumented by hand and gives the failure side of each flow for
 * free. Analytics runs inside trackApiWrite's own try/catch — it can never break a request.
 */
async function writeRequest(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, body?: any) {
  const token = getToken();
  const startedAt = Date.now();
  const resource = resourceFromPath(path);

  let res: Response;
  try {
    res = await fetch(getBaseUrl() + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch (networkError: any) {
    trackApiWrite({
      method,
      path,
      resource,
      succeeded: false,
      duration_ms: Date.now() - startedAt,
      error_message: networkError?.message ?? 'network error',
    });
    throw networkError;
  }

  const data = await res.json().catch(() => null);
  const duration_ms = Date.now() - startedAt;

  if (!res.ok) {
    handleUnauthorized(res, path);
    const message = data?.message || res.statusText || "Request failed";
    trackApiWrite({ method, path, resource, succeeded: false, status: res.status, duration_ms, error_message: message });
    const err: any = new Error(message);
    err.response = data;
    throw err;
  }

  trackApiWrite({ method, path, resource, succeeded: true, status: res.status, duration_ms });
  return data;
}

export async function postAuth(path: string, body: any) {
  return writeRequest('POST', path, body);
}

export async function getAuth(path: string) {
  const token = getToken();
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    handleUnauthorized(res, path);
    const message = data?.message || res.statusText || "Request failed";
    const err: any = new Error(message);
    err.response = data;
    throw err;
  }
  return data;
}

export async function putAuth(path: string, body: any) {
  return writeRequest('PUT', path, body);
}

export async function patchAuth(path: string, body: any) {
  return writeRequest('PATCH', path, body);
}

export async function deleteAuth(path: string) {
  return writeRequest('DELETE', path);
}

export function saveToken(token: string) {
  try {
    localStorage.setItem("authToken", token);
  } catch (e) {
    // ignore
  }
}

/** Clears the whole session — token plus the cached user — on logout. */
export function clearToken() {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem(BASE_URL_KEY);
  } catch (e) {
    // ignore
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getToken() {
  try {
    return localStorage.getItem("authToken");
  } catch (e) {
    return null;
  }
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
