"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import api from "@/api/api"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Token inválido ou expirado.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError("Token inválido ou expirado.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    try {
      // Exemplo de chamada de API:
      // await api.post("/reset-password", { token, password })

      await api.patch(`/email/update-password?token=${token}`, {new_password: password})

      setSubmitted(true)
    } catch  {
      setError("Erro ao redefinir senha. Tente novamente.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
         {submitted ? (
            <CardTitle>Faça Login com sua nova senha</CardTitle>
           
         ):(
            <>
              <CardTitle>Redefinir Senha</CardTitle>
               <CardDescription>
                  Escolha uma nova senha para sua conta
               </CardDescription>
            </>
         )}
         
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center text-green-600 space-y-4 text-sm">
              <p>Sua senha foi redefinida com sucesso.</p>
              <Link href="/login" className="underline underline-offset-4 text-blue-600">
                Fazer login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Redefinir senha
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
