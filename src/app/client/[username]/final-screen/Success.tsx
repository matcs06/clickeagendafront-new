'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface SuccessProps {
  serviceName: string
  servicePrice: string
  serviceAddress: string
  businessWhatsapp: string // com DDI, ex: '5562999999999'
  serviceTime: string
  serviceDate:string
}

export default function Success({
  serviceName,
  servicePrice,
  serviceAddress,
  businessWhatsapp,
  serviceTime,
  serviceDate,
}: SuccessProps) {
  const router = useRouter()
  const params = useParams()

  const username = params.username as string || ""
  const whatsappUrl = `https://wa.me/+55${businessWhatsapp}?text=Olá, estou entrando em contato sobre meu agendamento do serviço: ${serviceName}.`

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="text-green-500 mx-auto mb-2" size={48} />
          <h2 className="text-2xl font-bold">Agendamento Confirmado!</h2>
          <p className="text-muted-foreground text-sm mt-1">Você receberá uma mensagem de confirmação pelo WhatsApp</p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div>
            <p className="text-sm">Serviço: <strong>{serviceName}</strong></p>
            <p className="text-sm">Data: <strong>{serviceDate} </strong></p>
            <p className="text-sm">Horário: <strong>{serviceTime + " horas"} </strong></p>
            <p className="text-sm">Valor a ser pago: <strong>{servicePrice}</strong></p>
            <p className="text-sm">Endereço: <strong>{serviceAddress}</strong></p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="cursor-pointer w-full bg-green-500 hover:bg-green-600">
              Entrar em contato pelo WhatsApp
            </Button>
          </a>
          <Button variant="outline" className="cursor-pointer w-full mt-2" onClick={() => router.push(`/client/${username}/start-page`)}>
            Voltar para o início
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
