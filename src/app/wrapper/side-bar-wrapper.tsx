"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toogle";
import { ReactNode } from "react";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Define routes where the sidebar should be hidden
  const authRoutes = ["/login", "/register"];

  return (
    !authRoutes.includes(pathname) ? (
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <ModeToggle/>
        {children}
      </SidebarProvider>
    ) : (
      <>{children}</>
    )
  );
}
