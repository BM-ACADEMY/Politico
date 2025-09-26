import PrivateRoute from '@/context/PrivateRoute';
import CandidateAdd from '@/Modules/admin/Candidates/CandidateAdd';
import Dashboard from '@/Modules/admin/Dashboard/Dashboard';
import Profile from '@/Modules/admin/Profiles/Profile';
import Streetsandwards from '@/Modules/admin/Streetsandwards/Streetsandwards';

export const adminRoutes = [
  {
    path: '/admin_dashboard',
    element: (
      <PrivateRoute allowedRole="admin">
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin_dashboard/CandidatesAdd',
    element: (
      <PrivateRoute allowedRole="admin">
        <CandidateAdd />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin_dashboard/Profile',
    element: (
      <PrivateRoute allowedRole="admin">
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin_dashboard/streets-wards',
    element: (
      <PrivateRoute allowedRole="admin">
        <Streetsandwards />
      </PrivateRoute>
    ),
  },

];