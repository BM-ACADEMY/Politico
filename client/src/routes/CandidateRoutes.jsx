import PrivateRoute from '@/context/PrivateRoute';
// import CandidateDashboard from '@/modules/candidate/pages/dashboard/Dashboard';
// import CandidateJobs from '@/modules/candidate/pages/jobs/Jobs';
// import CandidateApplications from '@/modules/candidate/pages/applications/Applications';
// import CandidateProfile from '@/modules/candidate/pages/settings/Profile';
import Dashboard from '@/Modules/admin/pages/Dashboard';
import CandidateJobs from '@/Modules/candidate/pages/CandidateJobs';

export const candidateRoutes = [
  {
    path: '/candidate_manager_dashboard',
    element: (
      <PrivateRoute allowedRole="candidate_manager">
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/candidate-dashboard/jobs',
    element: (
      <PrivateRoute allowedRole="candidate_manager">
        <CandidateJobs />
      </PrivateRoute>
    ),
  },
  // {
  //   path: '/candidate-dashboard/applications',
  //   element: (
  //     <PrivateRoute allowedRole="candidate">
  //       <CandidateApplications />
  //     </PrivateRoute>
  //   ),
  // },
  // {
  //   path: '/candidate-dashboard/profile',
  //   element: (
  //     <PrivateRoute allowedRole="candidate">
  //       <CandidateProfile />
  //     </PrivateRoute>
  //   ),
  // },
];