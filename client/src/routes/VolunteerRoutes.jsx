import PrivateRoute from '@/context/PrivateRoute';
// import VolunteerDashboard from '@/modules/volunteer/pages/dashboard/Dashboard';
// import VolunteerEvents from '@/modules/volunteer/pages/events/Events';
// import VolunteerTasks from '@/modules/volunteer/pages/tasks/Tasks';
// import VolunteerProfile from '@/modules/volunteer/pages/settings/Profile';
import Dashboard from '@/Modules/admin/Dashboard/Dashboard';
export const volunteerRoutes = [
  {
    path: '/volunteer_dashboard',
    element: (
      <PrivateRoute allowedRole="volunteer">
        <Dashboard />
      </PrivateRoute>
    ),
  },
  // {
  //   path: '/volunteer-dashboard/events',
  //   element: (
  //     <PrivateRoute allowedRole="volunteer">
  //       <VolunteerEvents />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/volunteer-dashboard/tasks',
  //   element: (
  //     <PrivateRoute allowedRole="volunteer">
  //       <VolunteerTasks />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/volunteer-dashboard/profile',
  //   element: (
  //     <PrivateRoute allowedRole="volunteer">
  //       <VolunteerProfile />
  //     </PrivateRoute>
  //   ),
  // },
];