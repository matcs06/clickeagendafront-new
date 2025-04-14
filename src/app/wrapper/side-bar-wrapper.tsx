"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar"
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../auth/context/auth-context";
import PlansPage from "@/app/admin/pages/payment/plans/page";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const {getUserInfo} = useAuth()
  const userInfo = getUserInfo()
  const authRoutes = ["/login", "/signin", "/admin/pages/payments/success"];
  const childrenmod = <PlansPage/>
     
  const showPaymentPlansPage = userInfo.stripeSubscriptionId === null && !pathname.includes(authRoutes[0]) && !pathname.includes(authRoutes[1]) && !pathname.includes(authRoutes[2])

  
  console.log(showPaymentPlansPage)
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
        {!showPaymentPlansPage ? 
          children : childrenmod}
      </SidebarProvider>
    ) : (
      <>{children}</>
    )
  );
}
