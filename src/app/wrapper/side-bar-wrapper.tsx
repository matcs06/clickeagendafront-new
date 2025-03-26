"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toogle";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Define routes where the sidebar should be hidden
  const authRoutes = ["/login", "/register"];

  return (
    !authRoutes.includes(pathname) ? (
      <SidebarProvider>
        <AppSidebar />
        <div>
          <SidebarTrigger className="cursor-pointer"/>
          <ModeToggle />
        </div>
        {children}
      </SidebarProvider>
    ) : (
      <>{children}</>
    )
  );
}
