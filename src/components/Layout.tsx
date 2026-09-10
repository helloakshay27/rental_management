
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Below `lg` the sidebar is an off-canvas drawer instead of a fixed column:
  // a 240px rail leaves no usable width on a phone.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Navigating from the drawer should close it.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop rail — unchanged from lg upwards. */}
      <div className="hidden shrink-0 lg:flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile drawer + scrim */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 shadow-xl transition-transform duration-300 ease-in-out motion-reduce:transition-none lg:hidden',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar isCollapsed={false} onToggle={() => setMobileNavOpen(false)} />
      </div>

      {/* min-w-0 lets this column shrink below its content's intrinsic width.
          Without it a flex item defaults to min-width:auto, so one oversized
          child (a chart, a wide table) widens the whole page instead of
          scrolling inside its own container. */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-white p-0 m-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
