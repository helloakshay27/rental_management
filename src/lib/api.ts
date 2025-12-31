export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://rental-uat.lockated.com";

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
