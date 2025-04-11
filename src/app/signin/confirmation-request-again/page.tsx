"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui
import Cookies from "js-cookie";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import api from "@/api/api";

const EmailVerification = () => {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonTitle, setButtonTitle] = useState("Reenviar E-mail de Verificação")

  const sendVerificationEmail = async () => {
    setIsSending(true);
    setMessage("");

    const email = Cookies.get("email")
    
    try {
      await api.post("/email/send-verification",
        {email: email}
      );

      setMessage("Enviamos um e-mail de verificação. Por favor, verifique sua caixa de entrada!");
      console.log("sucesso")
    } catch  {
      setButtonTitle("Reenviar E-mail de Verificação")
      setMessage("Houve um erro ao enviar o e-mail de verificação. Por favor, tente novamente mais tarde!");
    } finally {
      setIsSending(false);
    }
  };


  return (
   <div className="flex items-center justify-center min-h-screen p-4 w-full">
     <Card className="w-full max-w-md">
       <CardHeader className="text-center">
         <h1 className="text-xl font-semibold">Ocorreu um erro ao confirmar seu e-mail. O link pode ter expirado — tente novamente.</h1>
       </CardHeader>
       <CardContent className="text-center">
         <p className="text-gray-600 dark:text-gray-300 mb-4">
           Você precisa verificar seu e-mail para continuar usando a plataforma.
         </p>

         <Button onClick={sendVerificationEmail} disabled={isSending} className="w-full cursor-pointer">
           {isSending ? (
             <>
               <Loader2 className="animate-spin mr-2" size={18} /> Enviando...
             </>
           ) : (
            `${buttonTitle}`
           )}
         </Button>

         {message && (
           <Alert variant="default" className="mt-4">
             <AlertDescription>{message}</AlertDescription>
           </Alert>
         )}
       </CardContent>
     </Card>
   </div>
 );
};

export default EmailVerification;
