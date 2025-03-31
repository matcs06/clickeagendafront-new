import { useAuth } from "@/app/auth/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "react-day-picker";

// app/signup/confirm-email/page.tsx
export default function ConfirmEmailPage() {
   const { email, logout } = useAuth(); // Pega o email do contexto
 
   return (
     <div className="flex min-h-screen items-center justify-center">
       <Card className="w-full max-w-md">
         <CardHeader>
           <CardTitle>Confirme seu Email</CardTitle>
           <CardDescription>
             Enviamos um link para <span className="font-semibold">{email}</span>.
             Verifique sua caixa de entrada e spam.
           </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <Button className="w-full" onClick={()=>{}}>
             Reenviar Email
           </Button>
           <Button  className="w-full" onClick={logout}>
             Sair
           </Button>
         </CardContent>
       </Card>
     </div>
   );
 }