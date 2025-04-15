"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/api/api"
import Cookies from "js-cookie"

const plan = {
  name: "Plano Essencial (Pequeno negócio)",
  benefits: [
    "Agendamentos ilimitadas",
    "Dashboard e calendaário de agendamentos",
    "Agenda individual para administrador",
    "Sem taxas",

  ],
  prices: {
    monthly: {
      id: "price_1RCX2109nOTi40nXpVWUp71M", // Stripe ID mensal
      label: "R$49,99/mês",
    },
    yearly: {
      id: "price_1RDwb809nOTi40nXsJBAWYwr", // Stripe ID anual
      label: "R$419,90/ano (30% off)", // 12x R$49,99 = R$599,88 → R$419,90
    },
  },
}

export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const user_id = Cookies.get("user_id")

      const response = await api.post("/payments/create-checkout-session", {
        user_id,
        price_id: billingCycle === "monthly" ? plan.prices.monthly.id : plan.prices.yearly.id,
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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Faça sua assinatura
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <Button
          className="cursor-pointer"
          variant={billingCycle === "monthly" ? "default" : "outline"}
          onClick={() => setBillingCycle("monthly")}
        >
          Mensal
        </Button>
        <Button
          className="cursor-pointer"
          variant={billingCycle === "yearly" ? "default" : "outline"}
          onClick={() => setBillingCycle("yearly")}
        >
          Anual (30% off)
        </Button>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="text-2xl font-bold">{plan.prices[billingCycle].label}</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            {plan.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <Button
            className="w-full cursor-pointer mt-4"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Redirecionando..." : "Assinar plano"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
