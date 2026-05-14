import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';

const LoadingScreen = () => (
  <div className="min-h-[100dvh] flex items-center justify-center bg-background text-white">
    <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster theme="dark" position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
