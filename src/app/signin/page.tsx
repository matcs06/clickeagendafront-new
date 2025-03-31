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
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

export default function SignInPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({ 
    name: "",
    username: "", 
    password: "",
    confirmPassword: "",
    email: ""
  });
  const [nonce, setNonce] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const success = await signUp(
      credentials.name,
      credentials.username, 
      credentials.email,
      credentials.password,
    );
    
    if (success) {
      toast.success("Conta criada com sucesso, faça seu login!");
      router.push("/login");
    } else {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  };

  useEffect(() => {
    const generateNonce = () => {
      return Math.random().toString(36).substring(2, 15);
    };

    setNonce(generateNonce());
    sessionStorage.setItem("google_nonce", nonce);

    return () => {};
  },[]);

  const handleGoogleSignUp = async () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}` +
      `&response_type=id_token` +
      `&scope=email%20profile` +
      `&prompt=select_account` +
      `&nonce=${nonce}`;

    window.location.href = googleAuthUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   console.log(e.target.value)
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center justify-items-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Criar conta no Click&Agenda</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  onChange={handleChange}
                  id="nae"
                  name="name"
                  type="text"
                  required
                />
              </div>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  name="password" 
                  id="password" 
                  type="password" 
                  required  
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  type="password" 
                  required  
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Criar Conta
                </Button>
              </div>
            </div>
          </form>
          
          <div className="flex flex-col gap-3 mt-4"> 
            <Button 
              type="button" 
              onClick={handleGoogleSignUp} 
              variant="outline" 
              className="w-full cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continuar com Google
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <a href="/login" className="underline underline-offset-4">
              Faça login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}