import PrivateRoute from '@/context/PrivateRoute';
// import CandidateDashboard from '@/modules/candidate/pages/dashboard/Dashboard';
// import CandidateJobs from '@/modules/candidate/pages/jobs/Jobs';
// import CandidateApplications from '@/modules/candidate/pages/applications/Applications';
// import CandidateProfile from '@/modules/candidate/pages/settings/Profile';
import Dashboard from '@/Modules/admin/Dashboard/Dashboard';
import VotersAdd from '@/Modules/admin/Voters/VotersAdd';
import AreamanagerAdd from '@/Modules/candidate/AreamanagerAdd/AreamanagerAdd';
import CandidateJobs from '@/Modules/candidate/pages/CandidateJobs';
import Volunteers from '@/Modules/candidate/Volunteers/Volunteers';

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
    path: 'candidate_manager_dashboard/area_manager',
    element: (
      <PrivateRoute allowedRole="candidate_manager">
        <AreamanagerAdd />
      </PrivateRoute>
    ),
  },
  {
    path: 'candidate_manager_dashboard/addvolunteer',
    element: (
      <PrivateRoute allowedRole="candidate_manager">
        <Volunteers />
      </PrivateRoute>
    ),
  },
  {
    path: 'candidate_manager_dashboard/votersAdd',
    element: (
      <PrivateRoute allowedRole="candidate_manager">
        <VotersAdd />
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