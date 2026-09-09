import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '@/lib/api';

/**
 * Route guard for everything inside the app shell.
 *
 * The token is re-read on every navigation (this component re-renders when the
 * location changes), so a token cleared in another tab — or by a 401 handler —
 * bounces the next route change to /login instead of rendering a page that
 * would fail every request.
 *
 * The attempted path is passed along in location state so Login can return the
 * user there after signing in.
 */
const RequireAuth = () => {
    const location = useLocation();
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }

    return <Outlet />;
};

export default RequireAuth;
