
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="rentals" element={<div className="p-6"><h1 className="text-2xl font-bold">Rental Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="opex" element={<div className="p-6"><h1 className="text-2xl font-bold">OPEX Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="utilities" element={<div className="p-6"><h1 className="text-2xl font-bold">Utility Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="amc" element={<div className="p-6"><h1 className="text-2xl font-bold">AMC Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
