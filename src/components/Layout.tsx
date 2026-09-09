
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {/* min-w-0 lets this column shrink below its content's intrinsic width.
          Without it a flex item defaults to min-width:auto, so one oversized
          child (a chart, a wide table) widens the whole page instead of
          scrolling inside its own container. */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white p-0 m-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
