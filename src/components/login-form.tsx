"use client"
import { cn } from "@/lib/utils"
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
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(credentials.username, credentials.password);
    if (success) {
      console.log("Login bem-sucedido!");
      router.push("/pages/dashboard");
    } else {
      toast.error("Usuário ou senha inválidos.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                  type="username"
                  placeholder="usuario"
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
                <Input id="password" type="password" required  onChange={handleChange}/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor cursor-pointer">
                  Login
                </Button>
                <Button variant="outline" className="w-full cursor-pointer">
                  Login com Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta ainda?{" "}
              <a href="#" className="underline underline-offset-4">
                Cadastre-se
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
