import { Routes, Route, Navigate } from 'react-router-dom';
import CalculatorPage from '../pages/CalculatorPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import HistoryPage from '../pages/HistoryPage';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/calculator" replace />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (Requires JWT Token) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route> 

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}