import PrivateRoute from '@/context/PrivateRoute';
// import SubadminDashboard from '@/modules/subadmin/pages/dashboard/Dashboard';
// import SubadminTasks from '@/modules/subadmin/pages/tasks/Tasks';
// import SubadminReports from '@/modules/subadmin/pages/reports/Reports';
// import SubadminProfile from '@/modules/subadmin/pages/settings/Profile';
import Dashboard from '@/Modules/admin/pages/Dashboard';
export const subadminRoutes = [
  {
    path: '/sub_admin_dashboard',
    element: (
      <PrivateRoute allowedRole="sub_admin">
        <Dashboard />
      </PrivateRoute>
    ),
  },
  // {
  //   path: '/subadmin-dashboard/tasks',
  //   element: (
  //     <PrivateRoute allowedRole="subadmin">
  //       <SubadminTasks />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/subadmin-dashboard/reports',
  //   element: (
  //     <PrivateRoute allowedRole="subadmin">
  //       <SubadminReports />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/subadmin-dashboard/profile',
  //   element: (
  //     <PrivateRoute allowedRole="subadmin">
  //       <SubadminProfile />
  //     </PrivateRoute>
  //   ),
  // },
];