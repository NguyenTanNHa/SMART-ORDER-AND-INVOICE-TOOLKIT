import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import CreateOrder from '@/pages/CreateOrder'
import History from '@/pages/History'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { AuthProvider, useAuth } from '@/lib/auth'
import './index.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateOrder />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <Toaster position="bottom-right" />
  </React.StrictMode>
)
