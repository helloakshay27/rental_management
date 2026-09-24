import React, { useState } from 'react';
import {
  RecentActiveUser,
  RecentActivityApiFilters,
  downloadActiveUsersExport,
} from '../api/analyticsApi';
import { useRecentActiveUsers } from '../api/queries';

export interface RecentActivitySidebarProps {
  /** The current filters applied to the dashboard (tenant/project, sites, devices, range, etc.) */
  filters?: RecentActivityApiFilters;
  /**
   * Flag indicating whether site/filter prerequisite data has settled.
   * If false, API calls are paused to avoid issuing unscoped requests.
   */
  sitesSettled?: boolean;
  /** Optional custom section title, defaults to "Recent Activity" */
  title?: string;
  /** Max users to fetch, defaults to 10 */
  limit?: number;
  /** Optional custom CSS class name */
  className?: string;
  /** Callback fired if export fails */
  onDownloadError?: (error: unknown) => void;
}

/**
 * Format relative minutes into human-friendly strings per requirement:
 *   - less than 1 minute: "just now"
 *   - less than 1 hour: "Xm ago"
 *   - less than 1 day: "Xh ago"
 *   - less than 30 days: "Xd ago"
 *   - otherwise: "Xmo ago"
 */
export function formatRelativeTime(minutes: number | null | undefined): string {
  if (minutes == null || isNaN(minutes) || minutes < 0) {
    return 'just now';
  }
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${Math.floor(minutes)}m ago`;
  }
  if (minutes < 1440) {
    return `${Math.floor(minutes / 60)}h ago`;
  }
  if (minutes < 43200) {
    return `${Math.floor(minutes / 1440)}d ago`;
  }
  const months = Math.floor(minutes / 43200);
  return `${Math.max(1, months)}mo ago`;
}

/**
 * Derives 1-2 letter uppercase initials from a user's display name.
 */
export function getInitials(name?: string | null): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const RecentActivitySidebar: React.FC<RecentActivitySidebarProps> = ({
  filters = {},
  sitesSettled = true,
  title = 'Recent Activity',
  limit = 10,
  className = '',
  onDownloadError,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Gated execution: Do not make the request until site/filter data has settled.
  const isEnabled = sitesSettled && filters.enabled !== false;

  const { data, isLoading, isError, error } = useRecentActiveUsers(filters, isEnabled, limit);

  if (isError && error) {
    // Log error gracefully without crashing
    console.error('Failed to load recent active users:', error);
  }

  const users: RecentActiveUser[] = data?.users ?? [];

  const handleDownload = async () => {
    if (isDownloading) return; // Prevent duplicate concurrent downloads
    setIsDownloading(true);
    try {
      await downloadActiveUsersExport(filters);
    } catch (err) {
      console.error('Failed to export active users:', err);
      if (onDownloadError) {
        onDownloadError(err);
      }
    } finally {
      setIsDownloading(false); // Restore button state
    }
  };

  return (
    <div className={`recent-activity ${className}`.trim()}>
      <div className="recent-activity-header">
        <div className="recent-activity-title-wrap">
          <span className="recent-activity-title">{title}</span>
        </div>
        <button
          type="button"
          className={`recent-activity-download-btn${isDownloading ? ' is-downloading' : ''}`}
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label="Download active users report"
          aria-disabled={isDownloading}
          title={isDownloading ? 'Downloading…' : 'Export active users (.xlsx)'}
        >
          {isDownloading ? (
            <svg
              className="recent-activity-spinner"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                strokeWidth="2"
                strokeDasharray="26"
                strokeDashoffset="10"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 10.5v2a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-2" />
              <path d="M8 2.5v7M5 6.5l3 3 3-3" />
            </svg>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="recent-activity-status" role="status" aria-live="polite">
          Loading…
        </div>
      ) : users.length === 0 ? (
        <div className="recent-activity-empty" role="status">
          No recent activity yet.
        </div>
      ) : (
        <ul className="recent-activity-list" aria-label="Recent active users">
          {users.map((user, idx) => {
            const screenOrEvent = user.path || user.last_event || 'Active';
            const timeAgo = formatRelativeTime(user.minutes_ago);
            return (
              <li
                key={user.user_id ? `${user.user_id}-${idx}` : `user-${idx}`}
                className="recent-activity-item"
              >
                <div className="recent-activity-avatar" aria-hidden="true">
                  {getInitials(user.display_name)}
                </div>
                <div className="recent-activity-content">
                  <div className="recent-activity-top">
                    <span
                      className="recent-activity-name"
                      title={user.display_name || 'Anonymous User'}
                    >
                      {user.display_name || 'Anonymous User'}
                    </span>
                    <span className="recent-activity-time">{timeAgo}</span>
                  </div>
                  <div className="recent-activity-screen" title={screenOrEvent}>
                    {screenOrEvent}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentActivitySidebar;
