import PrivateRoute from '@/context/PrivateRoute';
import CandidateAdd from '@/Modules/admin/pages/CandidateAdd';
// import adminDashboard from '@/modules/subadmin/pages/dashboard/Dashboard';
// import adminTasks from '@/modules/subadmin/pages/tasks/Tasks';
// import adminReports from '@/modules/subadmin/pages/reports/Reports';
// import adminProfile from '@/modules/subadmin/pages/settings/Profile';
import Dashboard from '@/Modules/admin/pages/Dashboard';
import Profile from '@/Modules/admin/pages/Profile';

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

];