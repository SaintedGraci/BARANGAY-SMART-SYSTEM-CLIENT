import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LandingPage } from './pages/landingpage';
import LoginPage from './pages/loginpage';
import AdminLogin from './pages/adminlogin';
import RegisterPage from './pages/registerpage';
import ForgotAccountPage from './pages/ForgotAccountPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TermsOfService from './pages/termsofservice';
import PrivacyPolicy from './pages/privacypolicy';
import Dashboard from './pages/dashboard';
import AdminDashboard from './pages/dashboard/adminDashboard';
import SuperadminDashboard from './pages/dashboard/SuperadminDashboard';
import { ProtectedRoute } from './components/protectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-account" element={<ForgotAccountPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Superadmin Dashboard (admin role only) - TASK15 */}
            <Route path="/superadmin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SuperadminDashboard />
              </ProtectedRoute>
            } />
            {/* Regular Admin Dashboard (captain, secretary, staff) */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['staff', 'secretary', 'captain']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;