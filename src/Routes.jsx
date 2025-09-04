import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Login from './pages/login';
import ReportDetailsView from './pages/report-details-view';
import ExecutiveDashboard from './pages/executive-dashboard';
import EmployeeDashboard from './pages/employee-dashboard';
import ClientReportForm from './pages/client-report-form';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ClientReportForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report-details-view" element={<ReportDetailsView />} />
        <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/client-report-form" element={<ClientReportForm />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
