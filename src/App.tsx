import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LandingPage } from './pages/landingpage';
import LoginPage from './pages/loginpage';
import AdminLogin from './pages/adminlogin';
import RegisterPage from './pages/registerpage';
import TermsOfService from './pages/termsofservice';
import PrivacyPolicy from './pages/privacypolicy';
import Dashboard from './pages/dashboard';
import AdminDashboard from './pages/dashboard/adminDashboard';
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
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'secretary', 'captain']}>
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