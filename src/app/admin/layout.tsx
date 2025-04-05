// app/admin/layout.tsx
import { SidebarWrapper } from "../wrapper/side-bar-wrapper";
import { AuthProvider } from "../auth/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarWrapper>
            {children}
          </SidebarWrapper>
      </ThemeProvider>
    </AuthProvider>
   
  );
}
