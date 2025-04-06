// app/admin/layout.tsx
import { SidebarWrapper } from "../wrapper/side-bar-wrapper";
import { ThemeProvider } from "@/components/theme-provider"
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
            {children}
          </SidebarWrapper>
      </ThemeProvider>
   
  );
}
