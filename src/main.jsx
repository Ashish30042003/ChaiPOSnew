import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './components/Auth'
import ChaiCornerPOS from './App.jsx'
import AdminApp from './AdminApp.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth themeColor="orange" />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Protected POS Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <ChaiCornerPOS />
              </ProtectedRoute>
            }
          />

          {/* Redirect old routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
