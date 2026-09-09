export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://rental-uat.lockated.com";

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
  const res = await fetch(`${API_BASE_URL}${path}`, {
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

export async function postAuth(path: string, body: any) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function getAuth(path: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
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
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function patchAuth(path: string, body: any) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export async function deleteAuth(path: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
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
