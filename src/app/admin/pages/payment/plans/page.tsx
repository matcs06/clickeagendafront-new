"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/api/api"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

import {users} from "@/lib/customInterfaceUsers"
import { toast } from "sonner"
import { usePlanModal } from "@/app/auth/context/payment-context"

const defaultPlan = {
  name: "Plano Essencial",
  benefits: [
    "Agendamentos ilimitadas",
    "Dashboard e calendaário de agendamentos",
    "Agenda individual para administrador",
    "Sem taxas",
    "Cobrança recorrente",
  ],
  prices: {
    monthly: {
      id: "price_1RGVPkP5Lov1Z48BsX2GrGXc", // Stripe ID mensal
      label: "R$49,99/mês",
    },
    yearly: {
      id: "price_1RGVQiP5Lov1Z48BAtOt8gfe", // Stripe ID anual
      label: "R$419,99/ano (30% off)", // 12x R$49,99 = R$599,88 → R$419,90
    },
  },
}



export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(defaultPlan)
    const { hidePlanModal } = usePlanModal();
  

    const router = useRouter()
  

  useEffect(()=>{
    const username = Cookies.get("user_name")
    const user = users.find((user) => user.name === username)

    if (user) {
      setPlan({
        name: `Plano Especial + Tela de cliente customizada`,
        benefits: [
          "Agendamentos ilimitadas",
          "Dashboard e calendaário de agendamentos",
          "Agenda individual para administrador",
          "Sem taxas",
          "Cobrança recorrente",
          "Tela de cliente customizada",
        ],
        prices: {
          monthly: {
            id: "price_1RGVRfP5Lov1Z48BNgvo97qx",
            label: "R$129,99/mês",
          },
          yearly: {
            id: "price_1RGVSQP5Lov1Z48B7cqOf6wd",
            label: "R$1091,99/ano (30% off)",
          },
        },
      })
    }
  },[])


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

  const handleFreeTrial = async () => {
    setLoading(true)
    try {
      const user_id = Cookies.get("user_id")
      
      console.log("passou aqui 1")
      await api.post(
        "/payments/free-trial",
        { userId: user_id }, // Body
       
      )
      toast.success("Plano gratuito ativado com sucesso!")
      hidePlanModal()
      router.push("/admin/pages/payment/free-trial")
    } catch  {
      toast.error("Erro ao ativar plano gratuito")
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
          <Button
            variant="outline"
            className="w-full cursor-pointer mt-2"
            onClick={handleFreeTrial}
            disabled={loading}
          >
            {loading ? "Ativando..." : "Plano gratuito (30 dias) sem cartão"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
