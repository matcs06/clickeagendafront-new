"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function FreeTrialSuccessPage() {
  const router = useRouter()

  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
      <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Teste gratuito ativado!</h1>
      <p className="text-muted-foreground mb-6">
        Você agora tem 30 dias para aproveitar todos os recursos. Nenhum cartão de crédito foi necessário.
      </p>
      <Button className="cursor-pointer" onClick={() => router.push("/admin/pages/dashboard")}>
        Ir para o Dashboard
      </Button>
    
    </div>
  )
}
