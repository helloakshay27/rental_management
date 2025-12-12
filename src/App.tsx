
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import RentalManagement from "./pages/RentalManagement";
import RentalDashboard from "./pages/RentalDashboard";
import AddRentalPage from "./pages/AddRentalPage";
import TenantDashboard from "./pages/TenantDashboard";
import Invoicing from "./pages/Invoicing";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/Login";
import OpexManagement from "./pages/OpexManagement";
import UtilityManagement from "./pages/UtilityManagement";
import AmcManagement from "./pages/AmcManagement";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Masters from "./pages/Masters";
import TenantsManagement from "./pages/masters/TenantsManagement";
import LandlordsManagement from "./pages/masters/LandlordsManagement";
import PropertiesMaster from "./pages/masters/PropertiesMaster";
import CompliancesMaster from "./pages/masters/CompliancesMaster";
import BrandingManagement from "./pages/masters/BrandingManagement";
import UsersManagement from "./pages/masters/UsersManagement";
import RolesManagement from "./pages/masters/RolesManagement";
import AccessManagement from "./pages/masters/AccessManagement";
import CountryMaster from "./pages/masters/CountryMaster";
import StatesMaster from "./pages/masters/StatesMaster";
import VendorMaster from "./pages/masters/VendorMaster";
import AddEditVendor from "./pages/masters/AddEditVendor";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="h-screen overflow-hidden bg-gray-50">
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="properties" element={<Properties />} />
                <Route path="properties/:id" element={<PropertyDetails />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="rentals" element={<RentalManagement />} />
                <Route path="rental-dashboard" element={<RentalDashboard />} />
                <Route path="rental/new" element={<AddRentalPage />} />
                <Route path="tenant-dashboard" element={<TenantDashboard />} />
                <Route path="invoicing" element={<Invoicing />} />
                <Route path="opex" element={<OpexManagement />} />
                <Route path="utilities" element={<UtilityManagement />} />
                <Route path="amc" element={<AmcManagement />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="masters" element={<Masters />} />
                <Route path="masters/tenants" element={<TenantsManagement />} />
                <Route path="masters/landlords" element={<LandlordsManagement />} />
                <Route path="masters/properties" element={<PropertiesMaster />} />
                <Route path="masters/compliances" element={<CompliancesMaster />} />
                <Route path="masters/branding" element={<BrandingManagement />} />
                <Route path="masters/users" element={<UsersManagement />} />
                <Route path="masters/roles" element={<RolesManagement />} />
                <Route path="masters/access" element={<AccessManagement />} />
                <Route path="masters/countries" element={<CountryMaster />} />
                <Route path="masters/states" element={<StatesMaster />} />
                <Route path="masters/vendors" element={<VendorMaster />} />
                <Route path="masters/vendors/add" element={<AddEditVendor />} />
                <Route path="masters/vendors/edit/:id" element={<AddEditVendor />} />
              </Route>
              <Route path="login" element={<LoginPage setToken={() => { }} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
