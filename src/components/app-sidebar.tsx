"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import {
  AudioWaveform,
  CalendarFold,
  Clock10Icon,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  WorkflowIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserAvatar } from "./ui/iconize";
import { TeamSwitcher } from "@/components/team-switcher";
import Cookies from "js-cookie";
// This is sample data.
const data = {
  user: {
    email: Cookies.get("user_name") || "Usuário",
    avatar: <UserAvatar name={Cookies.get("user_name")}/>,
  },
  teams: [
    {
      name: "BN",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/pages/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Serviços",
      url: "/admin/pages/services",
      icon: WorkflowIcon,
    },
    {
      title: "Horários",
      url: "/admin/pages/availability",
      icon: Clock10Icon,
    },
    {
      title: "Calendário",
      url: "#",
      icon: CalendarFold,
    },
  ],
};

// Define component normally
function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// Export with SSR disabled
export const AppSidebar = dynamic(() => Promise.resolve(AppSidebarComponent), {
  ssr: false,
});
