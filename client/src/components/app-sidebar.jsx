import * as React from "react";
import {
  IconInnerShadowTop,
  IconSettings,
  IconHelp,
  IconSearch,
  IconLogout,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AuthContext } from "@/context/AuthContext";
import { sidebarMenuItems, validRoles } from "@/utils/SidebarMenuitem";

export function AppSidebar({ ...props }) {
  const { user, logout } = React.useContext(AuthContext);

  // Get menu items based on user role, fallback to empty array if no user or invalid role
  const role = user?.role?.name && validRoles.includes(user.role.name) ? user.role.name : null;
  const navMainItems = role ? sidebarMenuItems[role] : [];

  // User data for NavUser
  const userData = user
    ? {
        name: user.name || "User",
        email: user.email || "No email",
        avatar: user.profileImage || "/avatars/default.jpg",
      }
    : { name: "Guest", email: "", avatar: "/avatars/default.jpg" };

  // Secondary navigation with logout
  const navSecondaryItems = [
    {
      title: "Settings",
      url: role ? `/${role}_dashboard/profile` : "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
    {
      title: "Logout",
      url: "#",
      icon: IconLogout,
      onClick: logout, // Call logout function
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Politico</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}