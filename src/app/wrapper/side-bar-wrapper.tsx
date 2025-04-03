"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../auth/context/auth-context";
import EmailVerification from "../admin/pages/email-verification/page";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const {getUserInfo} = useAuth()
  const userInfo = getUserInfo()
  const authRoutes = ["/login", "/signin"];

  const childrenmod = <EmailVerification/>
  
  const showEmailVerificationPage = userInfo.is_verified == "false" && !pathname.includes(authRoutes[0]) && !pathname.includes(authRoutes[1]) 
  // Define routes where the sidebar should be hidden
  return (
    !authRoutes.includes(pathname) ? (
      <SidebarProvider>
        <AppSidebar />
        {isMobile && (
          <div className="absolute z-30 left-4 mt-1 border-2 rounded-sm">
             <SidebarTrigger className="cursor-pointer"/>
          </div>
        )}
        {!showEmailVerificationPage ? 
          children : childrenmod}
      </SidebarProvider>
    ) : (
      <>{children}</>
    )
  );
}
