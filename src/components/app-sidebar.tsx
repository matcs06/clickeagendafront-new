"use client"

import * as React from "react"
import {
  AudioWaveform,
  CalendarFold,
  Clock10Icon,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  WorkflowIcon,
} from "lucide-react"
import Cookies from "js-cookie"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/app/auth/context/auth-context"
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
      isActive: true
    },
    {
      title: "Serviços",
      url: "/pages/services",
      icon: WorkflowIcon
    },
    {
      title: "Horários",
      url: "#",
      icon: Clock10Icon
    },
    {
      title: "Calendário",
      url: "#",
      icon: CalendarFold
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { name, business_name } = useAuth()
  const namec = Cookies.get("name")
  const business_namec = Cookies.get("business_name")
  const team = [
    {
      name: business_name || business_namec || "Empresa",
      logo: GalleryVerticalEnd,
      plan: name || namec || "Free",
    },
  ]
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
