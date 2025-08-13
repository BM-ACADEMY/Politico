import PrivateRoute from '@/context/PrivateRoute';
// import AreaManagerDashboard from '@/modules/area_manager/pages/dashboard/Dashboard';
// import AreaManagerTeams from '@/modules/area_manager/pages/teams/Teams';
// import AreaManagerTasks from '@/modules/area_manager/pages/tasks/Tasks';
// import AreaManagerProfile from '@/modules/area_manager/pages/settings/Profile';
import Dashboard from '@/Modules/admin/pages/Dashboard';
export const areaManagerRoutes = [
  {
    path: '/area_manager_dashboard',
    element: (
      <PrivateRoute allowedRole="area_manager">
        <Dashboard />
      </PrivateRoute>
    ),
  },
  // {
  //   path: '/area_manager-dashboard/teams',
  //   element: (
  //     <PrivateRoute allowedRole="area_manager">
  //       <AreaManagerTeams />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/area_manager-dashboard/tasks',
  //   element: (
  //     <PrivateRoute allowedRole="area_manager">
  //       <AreaManagerTasks />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/area_manager-dashboard/profile',
  //   element: (
  //     <PrivateRoute allowedRole="area_manager">
  //       <AreaManagerProfile />
  //     </PrivateRoute>
  //   ),
  // },
];