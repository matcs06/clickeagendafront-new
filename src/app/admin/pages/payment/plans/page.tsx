// pages/plans.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/api/api"
import Cookies from "js-cookie"
const plans = [
  {
    name: "Plano Padrão",
    price_id: "price_1RCX2109nOTi40nXpVWUp71M", // do Stripe
    benefits: ["200", "Até 2 funcionários + administrador"],
    price: "R$49,99/mês"
  },
  {
    name: "Plano Pro",
    price_id: "price_1RCXk709nOTi40nXwobgPGC1", // do Stripe
    benefits: ["Agendamentos ilimitados", "Até 10 funcionários + administrador", "Suporte prioritário"],
    price: "R$99,99/mês"
  }
]

export default function PlansPage() {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (price_id: string) => {
    setLoading(true)
    try {
      const user_id = Cookies.get("user_id") // ou vir do contexto

      const response = await api.post("/payments/create-checkout-session", {
         user_id,
         price_id
       })

      const data = await response.data
      window.location.href = data.url
    } catch (err) {
      console.error("Erro ao iniciar checkout:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Escolha seu plano</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <Card key={plan.name} className="flex flex-col justify-between">
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-2xl font-bold">{plan.price}</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {plan.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <Button
                className="w-full cursor-pointer"
                onClick={() => handleSubscribe(plan.price_id)}
                disabled={loading}
              >
                {loading ? "Redirecionando..." : "Assinar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
