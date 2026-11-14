// @vitest-environment jsdom
// Lease Management page parts with the API answers fixed: Recent Activity names people, the module chips
// request the API's key, and cards with no value show – instead of an invented number.
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const activity = vi.hoisted(() => ({ users: [] as unknown[] }));
vi.mock("../api/queries", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useRecentActiveUsers: () => ({ data: { users: activity.users }, isLoading: false, isError: false, error: null }),
}));

import { RecentActivitySidebar } from "../components/RecentActivitySidebar";
import { WorkflowSection } from "../sections/WorkflowSection";
import { AdoptionSection } from "../sections/AdoptionSection";
import type { AdoptionModel, ModuleRow } from "../data/metrics";
import type { Palette } from "../lib/palette";

const PALETTE: Palette = {
  ink: "#141413", faint: "#9b9990", grid: "#e6e4de", line: "#d9d6ce", blue: "#2c7be5", fill: "#d3e3f9",
  mint: "#3daf7d", amber: "#c98a12", red: "#b3402c", violet: "#7c6fd6", violetTint: "#e7e4f8", green: "#0f8a3d",
  greenTint: "#e2efe6", pos: "#17803d", neg: "#b3402c", heatRgb: "44,123,229", onHeat: "#fff", heatA0: 0.1, heatA1: 0.9,
};

afterEach(cleanup);

describe("Recent Activity", () => {
  it("shows the person's name the API sends (it used to say 'Anonymous User' for everyone)", () => {
    activity.users = [{ user_id: "1", user_name: "Asha Rao", email: "asha@x.com", path: "/opex", last_event: "$pageview", minutes_ago: 5, site_name: null }];
    render(<RecentActivitySidebar />);
    expect(screen.getAllByText("Asha Rao").length).toBeGreaterThan(0);
    expect(screen.queryByText("Anonymous User")).toBeNull();
  });

  it("falls back to the email's name part, then the user id", () => {
    activity.users = [
      { user_id: "7", email: "ravi.k@x.com", path: "/amc", last_event: null, minutes_ago: 1, site_name: null },
      { user_id: "9", path: "/opex", last_event: null, minutes_ago: 2, site_name: null },
    ];
    render(<RecentActivitySidebar />);
    expect(screen.getAllByText("ravi.k").length).toBeGreaterThan(0);
    expect(screen.getAllByText("User 9").length).toBeGreaterThan(0);
  });
});

describe("Workflow Usage module chips", () => {
  const MODULES: ModuleRow[] = [
    { key: "rental-dashboard", name: "Rental Dashboard", users: 2, events: 5, sessions: 3, share: 1 },
    { key: "opex", name: "Opex", users: 1, events: 2, sessions: 1, share: 0.5 },
  ];

  it("show the label but select the API's module key (a label with spaces matched nothing)", () => {
    const onModuleChange = vi.fn();
    render(
      <WorkflowSection active palette={PALETTE} modules={MODULES} activeModule="opex" onModuleChange={onModuleChange}
        subModules={null} activeSubModule={null} onSubModuleChange={() => {}} targets={{}} setTarget={() => {}}
        workflow={null} loading={false} error={null} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Rental Dashboard/ }));
    expect(onModuleChange).toHaveBeenCalledWith("rental-dashboard");
    expect(screen.getByRole("button", { name: /Opex/ }).getAttribute("aria-pressed")).toBe("true");
  });
});

describe("Adoption cards with no value", () => {
  const ADOPTION: AdoptionModel = {
    seatUtil: null, usedSeats: 1, stickiness: 20, adoptionTrend: 33.33, activation: null,
    moduleBreadthInUse: 0, moduleBreadthTotal: 0, dormant: 0,
    deltas: { seatUtil: null, stickiness: -60, activation: null },
  };

  it("Module Breadth shows – when the API has no total (it used to show '0 / 15')", () => {
    render(<AdoptionSection active showPrev palette={PALETTE} targets={{}} setTarget={() => {}} adoption={ADOPTION}
      trend={null} growth={null} cohorts={null} modules={null} activeUsers={1} loading={false} error={null} />);
    expect(screen.queryByText(/\/ 15/)).toBeNull();
    const card = screen.getByText("Module Breadth").closest(".tile")!;
    expect(card.textContent).toContain("—");
  });

  it("14-Day Activation shows – when there were no new users (not 0%)", () => {
    render(<AdoptionSection active showPrev palette={PALETTE} targets={{}} setTarget={() => {}} adoption={ADOPTION}
      trend={null} growth={null} cohorts={null} modules={null} activeUsers={1} loading={false} error={null} />);
    const card = screen.getByText("14-Day Activation").closest(".tile")!;
    expect(card.textContent).toContain("—");
    expect(card.textContent).not.toContain("0%");
    expect(screen.getByText("of new users")).toBeTruthy();
  });
});
