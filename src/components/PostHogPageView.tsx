import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import {
  getPostHogSuperProperties,
  getStoredUser,
  normalizeRoute,
  resolveModule,
} from '@/utils/posthogContext';
import { PROJECT_CODE, PROJECT_ID } from '@/utils/posthogHelpers';
import { getPageTitle, getPageViewEventName } from '@/utils/pageTitles';

/**
 * One `$pageview` per route change, plus the per-navigation refresh of the super-properties.
 *
 * Ported from fm-matrix-revamp's `components/PostHogPageView.tsx`. Autocapture and
 * posthog-js's own pageview tracking are off (see `main.tsx`) because a SPA's history
 * pushes do not map cleanly onto them; this component is the single source of pageviews.
 */
export function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;

    // Re-register on every navigation: `screen` is the dimension every module breakdown
    // groups by, so registering it here means each event helper inherits the right value
    // without remembering to set it (an explicit event property still wins). `user_role`
    // and `client_company` are unknown at init — the user has not signed in yet — so they
    // have to be refreshed once they are.
    posthog.register({
      ...getPostHogSuperProperties(),
      screen: normalizeRoute(location.pathname),
      page_name: getPageTitle(location.pathname),
      module: resolveModule(location.pathname),
    });

    const user = getStoredUser();
    const pageTitle = getPageTitle(location.pathname);

    const common = {
      $current_url: window.location.href,
      project_id: PROJECT_ID,
      project_code: PROJECT_CODE,
      page_name: pageTitle,
      user_id: user?.id ?? undefined,
      email: user?.email ?? undefined,
    };

    // The named twin of the SDK's `$pageview`: "Utilities Page Viewed" is its own row in the
    // event list, so a screen can be charted or funnelled without a URL filter every time.
    // `$pageview` and `$pageleave` themselves come from the SDK
    // (`capture_pageview: 'history_change'`, see lib/posthog.ts) and are not sent here.
    posthog.capture(getPageViewEventName(location.pathname), {
      ...common,
      action: 'page_view',
    });
  }, [location, posthog]);

  return null;
}

export default PostHogPageView;
