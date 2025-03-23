"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/auth/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(credentials.username, credentials.password);
    if (success) {
      toast.success("Login bem-sucedido!");
      router.push("/");
    } else {
      toast.error("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input id="username" name="username" value={credentials.username} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" value={credentials.password} onChange={handleChange} required />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
    </div>
  );
}
