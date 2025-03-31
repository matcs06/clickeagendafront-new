"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react" // Importação direta do ícone
import { useState } from "react"

export default function Pricing() {
  const plans = [
    {
      id: "trial",
      name: "Teste Grátis",
      price: "R$0",
      duration: "1 mês",
      features: [
        "Acesso completo a todos os recursos",
        "Analytics básicos",
        "Suporte por e-mail"
      ],
      cta: "Começar Teste"
    },
    {
      id: "standard",
      name: "Padrão (Mais popular)",
      price: "R$49,99",
      duration: "por mês",
      features: [
        "Tudo do Teste Grátis",
        "Analytics completo",
        "Suporte prioritário",
      ],
      cta: "Assinar Padrão"
    },
    {
      id: "pro",
      name: "Profissional",
      price: "R$129,99",
      duration: "por mês",
      features: [
        "Tudo do Plano Padrão",
        "Acesso à API",
        "Gerente de conta dedicado"
      ],
      cta: "Assinar Pro"
    }
  ]

  const [selectedPlan, setSelectedPlan] = useState("trial")

  const handlePlanSelection = async(id:string) =>{

      if(id == "trial"){
         
      }

  }

  return (
    <div className="grid gap-6 md:grid-cols-3 mt-14 px-7 ">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={selectedPlan === plan.id ? "border-2 border-primary" : ""}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">
                {plan.duration}
              </span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <RadioGroup 
              value={selectedPlan} 
              onValueChange={setSelectedPlan}
              className="grid gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={plan.id} id={plan.id} />
                <Label htmlFor={plan.id}>Selecionar {plan.name}</Label>
              </div>
            </RadioGroup>
            <ul className="grid gap-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handlePlanSelection(plan.id)}>
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}