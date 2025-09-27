import {
  IconDashboard,
  IconUsers,
  IconChartBar,
  IconBriefcase,
  IconFileText,
  IconCalendarEvent,
  IconUser,
  IconCheck,
} from "@tabler/icons-react";
import {ClipboardPlus ,LayoutDashboard, Users, UserPlus} from "lucide-react"

export const sidebarMenuItems = {
  admin: [
    { url: "/admin_dashboard", title: "Dashboard", icon: LayoutDashboard },
    { url: "/admin_dashboard/streets-wards", title: "Add Streets / Wards", icon: ClipboardPlus },
    { url: "/admin_dashboard/CandidatesAdd", title: "CandidatesAdd", icon: Users },
    { url: "/admin_dashboard/votersAdd", title: "VotersAdd", icon: UserPlus },




    
  ],
  sub_admin: [
    { url: "/subadmin-dashboard", title: "Dashboard", icon: IconDashboard },
    { url: "/subadmin-dashboard/tasks", title: "Tasks", icon: IconCheck },
    { url: "/subadmin-dashboard/reports", title: "Reports", icon: IconChartBar },
    { url: "/subadmin-dashboard/profile", title: "Profile", icon: IconUser },
  ],
  candidate_manager: [
    { url: "/candidate_manager_dashboard", title: "Dashboard", icon: IconDashboard },
    { url: "/candidate-dashboard/jobs", title: "Jobs", icon: IconBriefcase },
    { url: "/candidate-dashboard/applications", title: "Applications", icon: IconFileText },
    { url: "/candidate-dashboard/profile", title: "Profile", icon: IconUser },
  ],
  area_manager: [
    { url: "/area_manager-dashboard", title: "Dashboard", icon: IconDashboard },
    { url: "/area_manager-dashboard/teams", title: "Teams", icon: IconUsers },
    { url: "/area_manager-dashboard/tasks", title: "Tasks", icon: IconCheck },
    { url: "/area_manager-dashboard/profile", title: "Profile", icon: IconUser },
  ],
  volunteer: [
    { url: "/volunteer-dashboard", title: "Dashboard", icon: IconDashboard },
    { url: "/volunteer-dashboard/events", title: "Events", icon: IconCalendarEvent },
    { url: "/volunteer-dashboard/tasks", title: "Tasks", icon: IconCheck },
    { url: "/volunteer-dashboard/profile", title: "Profile", icon: IconUser },
  ],
};

export const validRoles = ["admin", "sub_admin", "candidate_manager", "area_manager", "volunteer"];