import PrivateRoute from '@/context/PrivateRoute';
// import adminDashboard from '@/modules/subadmin/pages/dashboard/Dashboard';
// import adminTasks from '@/modules/subadmin/pages/tasks/Tasks';
// import adminReports from '@/modules/subadmin/pages/reports/Reports';
// import adminProfile from '@/modules/subadmin/pages/settings/Profile';
import Dashboard from '@/Modules/admin/pages/Dashboard';

export const adminRoutes = [
  {
    path: '/admin_dashboard',
    element: (
      <PrivateRoute allowedRole="admin">
        <Dashboard />
      </PrivateRoute>
    ),
  },
  // {
  //   path: '/admin-dashboard/tasks',
  //   element: (
  //     <PrivateRoute allowedRole="admin">
  //       <adminTasks />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/admin-dashboard/reports',
  //   element: (
  //     <PrivateRoute allowedRole="admin">
  //       <adminReports />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/admin-dashboard/profile',
  //   element: (
  //     <PrivateRoute allowedRole="admin">
  //       <adminProfile />
  //     </PrivateRoute>
  //   ),
  // },
];