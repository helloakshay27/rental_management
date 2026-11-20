// @vitest-environment jsdom
// The usage-analytics API checks the user's login token (JWT) on every request: every Lease analytics
// request carries the token this app saved at login as Authorization: Bearer <token>.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchTrafficSession, fetchRecentActiveUsers } from "../api/analyticsApi";

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ users: [] }), { status: 200, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const auth = (n = 0) => ((fetchMock.mock.calls[n][1] as RequestInit).headers as Record<string, string>).Authorization;

describe("login token on Lease analytics requests", () => {
  it("sends the saved login token", async () => {
    localStorage.setItem("authToken", "lease.jwt.token");
    await fetchTrafficSession({ from: "2026-11-01", to: "2026-11-20" });
    await fetchRecentActiveUsers({ from: "2026-11-01", to: "2026-11-20" });
    expect(auth(0)).toBe("Bearer lease.jwt.token");
    expect(auth(1)).toBe("Bearer lease.jwt.token");
  });
  it("sends none when signed out", async () => {
    await fetchTrafficSession({ from: "2026-11-01", to: "2026-11-20" });
    expect(auth(0)).toBeUndefined();
  });
});
