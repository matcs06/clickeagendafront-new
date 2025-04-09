"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "lucide-react"
import api from "@/api/api"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode fazer a chamada para sua API de recuperação de senha

    try {
      await api.post("/email/send-password-recovery", {email})
      setSubmitted(true)
    } catch {
      toast.error("Erro ao enviar email")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
          <CardTitle>Recuperar Senha</CardTitle>
          <CardDescription>
            Informe seu e-mail para receber um link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center text-sm text-green-600 space-y-4">
              <p>
                Se encontrarmos este e-mail em nosso sistema, você receberá um link de recuperação em instantes.
              </p>
              <Link href="/" className="underline underline-offset-4 text-blue-600 hover:opacity-80 block">
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Enviar link de recuperação
                </Button>
                <Link href="/" className="text-center text-sm underline underline-offset-4 hover:opacity-80">
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
