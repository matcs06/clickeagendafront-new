// app/cliente/layout.tsx
import {ServiceProvider} from "@/app/auth/context/service-context";
export default function ClienteLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
      <ServiceProvider>

       {children}
      </ServiceProvider>
   );
 }
 