// @vitest-environment jsdom
// Lease Management's Recent Activity download: while the server makes the file the button spins and a
// line says what is happening; a failed download says so and is passed to onDownloadError.
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

const download = vi.hoisted(() => ({ fn: vi.fn() }));
vi.mock("../api/queries", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useRecentActiveUsers: () => ({ data: { users: [] }, isLoading: false, isError: false, error: null }),
}));
vi.mock("../api/analyticsApi", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  downloadActiveUsersExport: (...args: unknown[]) => download.fn(...args),
}));

import { RecentActivitySidebar } from "../components/RecentActivitySidebar";

const filters = { from: "2026-10-16", to: "2026-11-14" };

afterEach(() => {
  cleanup();
  download.fn.mockReset();
  vi.restoreAllMocks();
});

describe("Lease Recent Activity download", () => {
  it("shows a loader while the file is made, and the button again when it is saved", async () => {
    let finish!: () => void;
    download.fn.mockImplementation((_f: unknown, onPhase: (p: string) => void) => new Promise<void>((resolve) => {
      onPhase("preparing");
      finish = resolve;
    }));
    render(<RecentActivitySidebar filters={filters} />);
    const button = screen.getByRole("button", { name: "Download active users report" });
    await act(async () => { fireEvent.click(button); });

    expect(download.fn).toHaveBeenCalledWith(filters, expect.any(Function));
    expect(screen.getByText(/Preparing Excel file…/)).toBeTruthy();
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");

    await act(async () => { finish(); });
    expect(screen.queryByText(/Preparing Excel file…/)).toBeNull();
    expect(button.hasAttribute("disabled")).toBe(false);
  });

  it("says when a download failed and passes the error on", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = new Error("Export failed: The server is busy");
    download.fn.mockRejectedValue(failure);
    const onDownloadError = vi.fn();
    render(<RecentActivitySidebar filters={filters} onDownloadError={onDownloadError} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Download active users report" })); });
    expect(screen.getByText("Download failed. Please try again.")).toBeTruthy();
    expect(onDownloadError).toHaveBeenCalledWith(failure);
  });
});
