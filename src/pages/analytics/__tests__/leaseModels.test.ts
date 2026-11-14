// @vitest-environment jsdom
// Lease Management: turning API answers into what the page shows, the (i) texts, and the analytics context
// stamped on every event (user_id, so page views count people).
import { afterEach, describe, expect, it } from "vitest";
import { buildAdoption, buildModules } from "../data/metrics";
import { KPI_INFO, kpiInfo } from "../lib/kpi-info";
import { getPostHogSuperProperties } from "@/utils/posthogContext";
import type { AdoptionEngagementResponse, ModulesResponse } from "../api/analyticsApi";

afterEach(() => localStorage.clear());

describe("module rows", () => {
  it("keep the API's key for requests and a readable label for the screen", () => {
    const rows = buildModules({ tree: [
      { name: "rental-dashboard", users: 2, events: 5, sessions: 3 },
      { name: "opex", users: 4, events: 9, sessions: 6 },
    ] } as unknown as ModulesResponse)!;
    expect(rows.map((r) => r.key)).toEqual(["rental-dashboard", "opex"]);
    expect(rows[0].name).not.toBe("rental-dashboard");
    expect(rows[0].name.toLowerCase()).toContain("rental");
    expect(rows[1].share).toBe(1); // the busiest module
  });

  it("no tree → no rows (no sample data)", () => {
    expect(buildModules({ tree: [] } as unknown as ModulesResponse)).toBeNull();
    expect(buildModules(undefined)).toBeNull();
  });
});

describe("adoption model", () => {
  const RES = {
    seat_utilisation: { value: null, used_seats: 1, licensed_seats: null, delta_pct: null },
    stickiness: { value: 20, avg_dau: 0.2, mau: 1, delta_pct: -60 },
    adoption_trend: { value: 33.33, wau_now: 1, wau_4wk_ago: 1 },
    activation: { value: null, joiners: 0, delta_pct: null },
    module_breadth: { in_use: 0, total: 0 },
    dormant_users: { value: 0, band: "14+ days" },
  } as unknown as AdoptionEngagementResponse;

  it("keeps 'no value' for activation when the period has no new users (shown as –, not 0%)", () => {
    expect(buildAdoption(RES)!.activation).toBeNull();
  });

  it("passes the API's own module breadth total (0 here), never a fixed 15", () => {
    const a = buildAdoption(RES)!;
    expect(a.moduleBreadthTotal).toBe(0);
    expect(a.moduleBreadthInUse).toBe(0);
  });

  it("maps the other values as they come", () => {
    const a = buildAdoption({ ...RES, activation: { value: 75, joiners: 4, delta_pct: null } } as unknown as AdoptionEngagementResponse)!;
    expect(a.activation).toBe(75);
    expect(a.stickiness).toBe(20);
    expect(a.adoptionTrend).toBe(33.33);
    expect(a.usedSeats).toBe(1);
  });
});

describe("(i) texts", () => {
  const CARDS = ["Active Admins", "Screen Views", "Sessions", "Session Duration", "Bounce Rate", "Seat Utilisation",
                 "Stickiness", "Adoption Trend", "14-Day Activation", "Module Breadth",
                 "Workflow Adoption", "Completion Rate", "Biggest Step Drop", "Usage Volume", "Dormant Admins"];

  it("every card on the page has a finished explanation", () => {
    for (const c of CARDS) expect(kpiInfo(c).f, c).not.toMatch(/not yet finalized/);
  });

  it("they describe what the backend counts", () => {
    expect(KPI_INFO["Screen Views"].f).toMatch(/\$pageview/);
    expect(KPI_INFO["Bounce Rate"].f).toMatch(/never got past the launch pages/);
    expect(KPI_INFO["Module Breadth"].f).not.toMatch(/15/);
    expect(KPI_INFO["Module Breadth"].f).toMatch(/at least 3 Admins/);
    expect(KPI_INFO["Usage Volume"].f).toMatch(/Admins who reached the funnel's last step/);
    expect(KPI_INFO["14-Day Activation"].f).toMatch(/within 14 days/);
  });
});

describe("analytics context on every event", () => {
  it("carries the signed-in user's id, so page views count people", () => {
    localStorage.setItem("user", JSON.stringify({ id: 301, email: "a@b.c" }));
    const p = getPostHogSuperProperties();
    expect(p.user_id).toBe(301);
    expect(p.project_code).toBe("LMV-01");
    expect(p.platform).toBe("web");
  });

  it("has no user id when signed out (never a placeholder)", () => {
    expect(getPostHogSuperProperties().user_id).toBeUndefined();
    localStorage.setItem("user", JSON.stringify({ id: 0 }));
    expect(getPostHogSuperProperties().user_id).toBeUndefined();
  });

  it("marks a developer's machine as a test build (left out of the dashboard)", () => {
    expect(getPostHogSuperProperties().is_test).toBe(true); // tests run in dev mode on localhost
  });
});
