import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/context/PrivateRoute';
import LoginPage from '@/Modules/Auth/Login';
import ForgotPassword from '@/Modules/Auth/ForgotPassword';
import VerifyOTP from '@/Modules/Auth/VerifyOTP';
import ResetPassword from '@/Modules/Auth/ResetPassword';
import { adminRoutes } from '@/routes/AdminRoutes';
import { subadminRoutes } from '@/routes/SubadminRoutes';
import { candidateRoutes } from '@/routes/CandidateRoutes';
import { areaManagerRoutes } from '@/routes/AreaManagerRoutes';
import { volunteerRoutes } from '@/routes/VolunteerRoutes';
import Page from './Modules/Pages/main-dashboard/Page';
import VerifyEmail from './Modules/Auth/VerifyEmail';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PrivateRoute allowedRole="public"><LoginPage /></PrivateRoute>} />
        <Route path="/login" element={<PrivateRoute allowedRole="public"><LoginPage /></PrivateRoute>} />
        <Route path="/forgot-password" element={<PrivateRoute allowedRole="public"><ForgotPassword /></PrivateRoute>} />
        <Route path="/verify-otp" element={<PrivateRoute allowedRole="public"><VerifyOTP /></PrivateRoute>} />
        <Route path="/reset-password" element={<PrivateRoute allowedRole="public"><ResetPassword /></PrivateRoute>} />
        <Route path="/verify-email" element={<PrivateRoute allowedRole="public"><VerifyEmail /></PrivateRoute>} />
        <Route element={<Page />}>
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {subadminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {candidateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {areaManagerRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {volunteerRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;