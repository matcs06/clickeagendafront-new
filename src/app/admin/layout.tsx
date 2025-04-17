// app/admin/layout.tsx
import { SidebarWrapper } from "../wrapper/side-bar-wrapper";
import { ThemeProvider } from "@/components/theme-provider"
import { PlanProvider } from "../auth/context/payment-context";
import ModalWrapper from "@/components/modal-wrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarWrapper>
            <PlanProvider>
              <ModalWrapper />
              {children}
            </PlanProvider>
          </SidebarWrapper>
      </ThemeProvider>
   
  );
}
