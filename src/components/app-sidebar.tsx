"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import {
  CalendarFold,
  Clock10Icon,
  LayoutDashboard,
  WorkflowIcon,
  UserCog
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
  //useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "./ui/iconize";
import { TeamSwitcher } from "@/components/team-switcher";
import Cookies from "js-cookie";

// Define component normally
function AppSidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {state, isMobile} = useSidebar()
  
  const [data,] = React.useState(
    {
      user: {
        email: Cookies.get("user_name") || "Usuário",
        avatar: <UserAvatar name={Cookies.get("user_name")}/>,
      },
      navMain: [
        {
          title: "Dashboard",
          url: "/admin/pages/dashboard",
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
          url: "/admin/pages/schduller",
          icon: CalendarFold,
        },
        {
          title: "Tela do Cliente",
          url: `/client/${Cookies.get("user_name")}/start-page`,
          icon: UserCog,
        },
      ],
    }
  )

  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={`flex justify-between ${state == "collapsed" && !isMobile ? "flex-col" : "flex-row"}`}>
        <TeamSwitcher />
        <SidebarTrigger className="cursor-pointer"/>
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
