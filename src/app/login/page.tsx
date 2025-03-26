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
import { useState } from "react"
import { toast } from "sonner"
import {  useRouter } from "next/navigation";
declare global {
  interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}


export default function LoginPage() {
  const { login } = useAuth();
  
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(credentials.password, credentials.username)

    const success = await login(credentials.username, credentials.password);
    if (success) {
      router.push("/pages/dashboard");
    } else {
      toast.error("Usuário ou senha inválidos.");
    }
  };

  const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15);  // Generates a random string
  };

  const nonce = generateNonce();  // Generate a random nonce
  sessionStorage.setItem("google_nonce", nonce);  // Store it temporarily for later validation
  
  const handleGoogleLogin = async () => {
    console.log(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI)
    console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}` +
    `&response_type=id_token` +
    `&scope=email%20profile` +
    `&prompt=select_account` +
    `&nonce=${nonce}`;  // Include the nonce in the URL

    window.location.href = googleAuthUrl;

  };

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
                <Label htmlFor="username">Usuário</Label>
                <Input
                  onChange={handleChange}
                  id="username"
                  name="username"
                  type="text"
                  required
                
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
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
                  Continuar com Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
              Não tem uma conta ainda?{" "}
              <a href="#" className="underline underline-offset-4">
                Cadastre-se
              </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
