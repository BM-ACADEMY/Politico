import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/context/PrivateRoute';
import LoginPage from '@/Modules/Auth/Login';
// import Register from '@/modules/common/pages/Register';
// import VerifyEmail from '@/modules/common/pages/verify/VerifyEmail';
// import ForgotPassword from '@/modules/common/pages/verify/ForgotPassword';
// import ResetPassword from '@/modules/common/pages/verify/ResetPassword';
// import { userRoutes } from '@/modules/common/routes/UserRoutes';
import { adminRoutes } from '@/routes/AdminRoutes';
import { subadminRoutes } from '@/routes/SubadminRoutes';
import { candidateRoutes } from '@/routes/CandidateRoutes';
import { areaManagerRoutes } from '@/routes/AreaManagerRoutes';
import { volunteerRoutes } from '@/routes/VolunteerRoutes';
import Page from './Modules/Pages/main-dashboard/page';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PrivateRoute allowedRole="public"><LoginPage /></PrivateRoute>} />
        {/* <Route path="/register" element={<PrivateRoute allowedRole="public"><Register /></PrivateRoute>} />
        <Route path="/verify-email" element={<PrivateRoute allowedRole="public"><VerifyEmail /></PrivateRoute>} />
        <Route path="/forgot-password" element={<PrivateRoute allowedRole="public"><ForgotPassword /></PrivateRoute>} />
        <Route path="/reset-password" element={<PrivateRoute allowedRole="public"><ResetPassword /></PrivateRoute>} /> */}
        {/* <Route path="/admin-login" element={<PrivateRoute allowedRole="login"><LoginPage access="admin" /></PrivateRoute>} />
        <Route path="/subadmin-login" element={<PrivateRoute allowedRole="login"><LoginPage access="subadmin" /></PrivateRoute>} />
        <Route path="/candidate-login" element={<PrivateRoute allowedRole="login"><LoginPage access="candidate" /></PrivateRoute>} />
        <Route path="/area_manager-login" element={<PrivateRoute allowedRole="login"><LoginPage access="area_manager" /></PrivateRoute>} />
        <Route path="/volunteer-login" element={<PrivateRoute allowedRole="login"><LoginPage access="volunteer" /></PrivateRoute>} /> */}
        {/* Role-Specific Routes */}
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
          {/* {userRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))} */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;