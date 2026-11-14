// @vitest-environment jsdom
// Lease Management analytics → its own API. The backend fixes the scope (project code LMV-01, the live web
// build), so every request goes to /commercial/lease/adoption/* (not the removed /fm/adoption/*) and carries
// only filters.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_API_PATH,
  analyticsScopeLabel,
  buildRecentActivityParams,
  downloadActiveUsersExport,
  fetchAdoptionEngagement,
  fetchAdoptionTrend,
  fetchModules,
  fetchRecentActiveUsers,
  fetchTrafficSession,
  fetchWorkflowUsage,
} from "../api/analyticsApi";

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  // A fresh answer per call (a Response body can be read once).
  fetchMock = vi.fn().mockImplementation(async () =>
    new Response("{}", { status: 200, headers: { "content-type": "application/json" } }),
  );
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const req = (n = 0) => {
  const url = new URL(String(fetchMock.mock.calls[n][0]), "http://localhost");
  return { path: url.pathname, params: Object.fromEntries(url.searchParams.entries()) };
};
const RANGE = { from: "2026-10-15", to: "2026-11-13" };

describe("Lease Management analytics requests", () => {
  it("use Lease Management's own API", async () => {
    expect(ANALYTICS_API_PATH).toBe("commercial/lease");
    await fetchTrafficSession(RANGE);
    expect(req().path).toMatch(/\/commercial\/lease\/adoption\/traffic_session$/);
    expect(req().path).not.toMatch(/\/fm\/adoption\//);
  });

  it("send only the date range (no project_code, no url)", async () => {
    await fetchTrafficSession(RANGE);
    expect(req().params).toEqual(RANGE);
  });

  it("weekly endpoints send to / weeks; licensed seats only when known", async () => {
    await fetchAdoptionTrend({ to: "2026-11-13", weeks: 8 });
    await fetchAdoptionEngagement({ ...RANGE, licensedSeats: null });
    await fetchAdoptionEngagement({ ...RANGE, licensedSeats: 55 });
    expect(req(0).params).toEqual({ to: "2026-11-13", weeks: "8" });
    expect(req(1).params).toEqual(RANGE);
    expect(req(2).params).toEqual({ ...RANGE, licensed_seats: "55" });
  });

  it("modules and workflow usage send the API's module key", async () => {
    await fetchModules({ ...RANGE, module: "rental-dashboard" });
    await fetchWorkflowUsage({ ...RANGE, module: "opex", subModule: "new" });
    expect(req(0)).toEqual({ path: expect.stringMatching(/\/commercial\/lease\/adoption\/modules$/), params: { ...RANGE, module: "rental-dashboard" } });
    expect(req(1).params).toEqual({ ...RANGE, module: "opex", sub_module: "new" });
  });

  it("recent activity sends limit and range only, whatever else the page passes", async () => {
    const params = buildRecentActivityParams(
      { ...RANGE, project_code: "LMV-01", site_ids: ["1", "2"], devPlatform: "desktop" }, 10);
    expect(params).toEqual({ limit: "10", ...RANGE });
    await fetchRecentActiveUsers({ ...RANGE }, 10);
    expect(req().path).toMatch(/\/commercial\/lease\/adoption\/recent_active_users$/);
  });

  it("the download uses Lease Management's API", async () => {
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: () => "blob:x", revokeObjectURL: () => {} }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {}); // no navigation in jsdom
    fetchMock.mockResolvedValueOnce(new Response(new Blob(["x"]), { status: 200 }));
    await downloadActiveUsersExport({ ...RANGE });
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/commercial\/lease\/adoption\/active_users_export\?/);
    expect(click).toHaveBeenCalled();
  });

  it("an error answer is an error, not empty data", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 422, statusText: "Unprocessable" }));
    await expect(fetchTrafficSession(RANGE)).rejects.toThrow(/422/);
  });

  it("the scope label names what is counted", () => {
    expect(analyticsScopeLabel()).toBe("Lease Management live web app (LMV-01)");
  });
});
