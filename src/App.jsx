import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ToastContainer from './components/common/ToastContainer';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import BrowsePage from './pages/public/BrowsePage';
import AboutPage from './pages/public/AboutPage';
import ResourceDetailPage from './pages/public/ResourceDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Receiver Pages
import ReceiverOverview from './pages/receiver/ReceiverOverview';
import ReceiverClaims from './pages/receiver/ReceiverClaims';
import ReceiverSchedule from './pages/receiver/ReceiverSchedule';
import ReceiverNotifications from './pages/receiver/ReceiverNotifications';
import UserProfilePage from './pages/receiver/UserProfilePage';

// Donor Pages
import DonorOverview from './pages/donor/DonorOverview';
import CreateListingPage from './pages/donor/CreateListingPage';
import MyListingsPage from './pages/donor/MyListingsPage';
import IncomingClaimsPage from './pages/donor/IncomingClaimsPage';
import DonorSchedulePage from './pages/donor/DonorSchedulePage';
import DonorImpactPage from './pages/donor/DonorImpactPage';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function DashboardGuard({ allowedRole, title, children }) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return (
    <DashboardLayout role={allowedRole} title={title}>
      {children}
    </DashboardLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/resources/:id" element={<ResourceDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Receiver Dashboard Routes */}
      <Route
        path="/receiver"
        element={
          <DashboardGuard allowedRole="receiver" title="Dashboard Overview">
            <ReceiverOverview />
          </DashboardGuard>
        }
      />
      <Route
        path="/receiver/browse"
        element={
          <DashboardGuard allowedRole="receiver" title="Browse Resources">
            <BrowsePage embedded basePath="/receiver/resources" />
          </DashboardGuard>
        }
      />
      <Route
        path="/receiver/resources/:id"
        element={
          <DashboardGuard allowedRole="receiver" title="Resource Details">
            <ResourceDetailPage embedded />
          </DashboardGuard>
        }
      />
      <Route
        path="/receiver/claims"
        element={
          <DashboardGuard allowedRole="receiver" title="My Claims">
            <ReceiverClaims />
          </DashboardGuard>
        }
      />
      <Route
        path="/receiver/schedule"
        element={
          <DashboardGuard allowedRole="receiver" title="Pickup Schedule & QR Passes">
            <ReceiverSchedule />
          </DashboardGuard>
        }
      />
      <Route
        path="/receiver/notifications"
        element={
          <DashboardGuard allowedRole="receiver" title="Notifications">
            <ReceiverNotifications />
          </DashboardGuard>
        }
      />
      <Route
        path="/receiver/profile"
        element={
          <DashboardGuard allowedRole="receiver" title="My Profile">
            <UserProfilePage />
          </DashboardGuard>
        }
      />

      {/* Donor Dashboard Routes */}
      <Route
        path="/donor"
        element={
          <DashboardGuard allowedRole="donor" title="Dashboard Overview">
            <DonorOverview />
          </DashboardGuard>
        }
      />
      <Route
        path="/donor/create"
        element={
          <DashboardGuard allowedRole="donor" title="Create Resource Listing">
            <CreateListingPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/donor/listings"
        element={
          <DashboardGuard allowedRole="donor" title="My Listings">
            <MyListingsPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/donor/claims"
        element={
          <DashboardGuard allowedRole="donor" title="Incoming Claims">
            <IncomingClaimsPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/donor/schedule"
        element={
          <DashboardGuard allowedRole="donor" title="Pickup Schedule">
            <DonorSchedulePage />
          </DashboardGuard>
        }
      />
      <Route
        path="/donor/impact"
        element={
          <DashboardGuard allowedRole="donor" title="Impact Summary">
            <DonorImpactPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/donor/profile"
        element={
          <DashboardGuard allowedRole="donor" title="Donor Profile">
            <UserProfilePage />
          </DashboardGuard>
        }
      />

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <DashboardGuard allowedRole="admin" title="Admin Overview">
            <AdminOverview />
          </DashboardGuard>
        }
      />
      <Route
        path="/admin/users"
        element={
          <DashboardGuard allowedRole="admin" title="User Management">
            <AdminUsersPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/admin/listings"
        element={
          <DashboardGuard allowedRole="admin" title="Listing Management">
            <AdminListingsPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/admin/verifications"
        element={
          <DashboardGuard allowedRole="admin" title="Organization Verification">
            <AdminVerificationsPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <DashboardGuard allowedRole="admin" title="Reports & Analytics">
            <AdminReportsPage />
          </DashboardGuard>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <DashboardGuard allowedRole="admin" title="Platform Settings">
            <AdminSettingsPage />
          </DashboardGuard>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
