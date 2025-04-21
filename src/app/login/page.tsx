"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/auth/context/auth-context"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {  useRouter } from "next/navigation";
import Cookies from "js-cookie"
declare global {
  interface Window {
    google: any;
  }
}


export default function LoginPage() {
  const { login, refreshBeforeRequest } = useAuth();
  
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username_or_email: "", password: "" });
  const [nonce, setNonce] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(credentials.username_or_email, credentials.password);
    if (success == "true") {
      if(!Cookies.get("business_name") || !Cookies.get("phone")){
        router.push("/admin/pages/addinfo")
      }else{
        router.push("/admin/pages/dashboard");
      }
    } else if(success == "verifyemail") {
      router.push("/signin/confirmation-request")
      toast.warning("Verifique seu email antes de fazer login");
    }else{
      toast.error("Email ou senha inválidos")
    }
  };

  useEffect(()=>{
    const generateNonce = () => {
      return Math.random().toString(36).substring(2, 15);  // Generates a random string
    };



    setNonce(generateNonce)
    sessionStorage.setItem("google_nonce", nonce);  // Store it temporarily for later validation

    const checkSession = async () => {
      try {

        const token = Cookies.get("token");

        await refreshBeforeRequest(token)
  
        console.log("passou aqui 2")

        router.push("/admin/pages/dashboard");
        
      } catch  {
        console.log("User not authenticated");
      }
    };

    checkSession();

    return ()=>{}
  },[])
  
  const handleGoogleLogin = async () => {

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}` +
    `&response_type=id_token` +
    `&scope=email%20profile` +
    `&prompt=select_account` +
    `&nonce=${nonce}`;  // Include the nonce in the URL

    window.location.href = googleAuthUrl;

  };

  const handleSignUp = ()=>{
    router.push("/signin");

  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex justify-center justify-items-center items-center min-h-screen">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Login no Click&Agenda</CardTitle>
          <CardDescription>
            Entre com seu usuário e senha para acessar a sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username_or_email">Usuário ou Email</Label>
                <Input
                  onChange={handleChange}
                  id="username_or_email"
                  name="username_or_email"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center" onClick={()=> router.push("/new-password-request")}>
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input name="password" id="password" type="password" required  onChange={handleChange}/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor cursor-pointer">
                  Login
                </Button>
              </div>
            </div>
          </form>
          <div className="flex flex-col gap-3 mt-4"> 
            <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continuar com Google
            </Button>
          </div>
          <div onClick={handleSignUp} className="mt-4 text-center text-sm">
              Não tem uma conta ainda?{" "}
              <a href="/signin" className="underline underline-offset-4">
                Cadastre-se
              </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
