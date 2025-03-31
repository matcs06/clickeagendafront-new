"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  
  // Define routes where the sidebar should be hidden
  const authRoutes = ["/login", "/register"];


  return (
    !authRoutes.includes(pathname) ? (
      <SidebarProvider>
        <AppSidebar />
        {isMobile && (
          <div className="absolute z-30 left-4 mt-1 border-2 rounded-sm">
             <SidebarTrigger className="cursor-pointer"/>
          </div>
        )}
        
        {children}
      </SidebarProvider>
    ) : (
      <>{children}</>
    )
  );
}
