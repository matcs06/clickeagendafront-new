'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import api from '@/api/api' // ajuste para seu caminho real
import { BRLReais } from '@/lib/utils' // ajuste se necessário
import { toast } from 'sonner'
import { useService } from '@/app/auth/context/service-context'

//import InputMask from 'react-input-mask'


export default function CustomerInfo() {


  const router = useRouter()
  const {selectedService} = useService()

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  let parsed:any;
  useEffect(() => {
    
    const localData = localStorage.getItem('customer_info_clickagenda')
    if (localData) {
      try {
        const parsed = JSON.parse(localData)
        if (parsed?.customerName) setCustomerName(parsed.customerName)
        if (parsed?.customerPhone) setCustomerPhone(parsed.customerPhone)
      } catch {
      }
    }
  }, [])

  const handleSchedule = async () => {
   const localData = localStorage.getItem('customer_info_clickagenda')
   if (localData) {
     try {
      parsed = JSON.parse(localData)
       if (parsed?.customerName) setCustomerName(parsed.customerName)
       if (parsed?.customerPhone) setCustomerPhone(parsed.customerPhone)
     } catch {
     }
   }
    const serviceDuration = selectedService?.duration|| ''
    const choosedDate = selectedService?.choosed_date || ''
    const choosedTime = selectedService?.choosed_time || ''
    const serviceName = selectedService?.name || parsed.name
    const servicePrice = selectedService?.price || parsed.price
    const userId = localStorage.getItem("ca_admin_user_id") || ""
    if (!customerName) return toast.error('Informe o seu nome')
    if (!customerPhone || customerPhone.length < 8)
      return toast.error('Informe um número de telefone válido com DDD')

    const isMorning = Number(choosedTime.split(":")[0]) < 12

    try {
      await api.post('/schedules', {
        customer_name: customerName,
        service: serviceName,
        date: choosedDate,
        start_time: choosedTime,
        service_duration: serviceDuration,
        phone_number: customerPhone,
        isMorning,
        price: servicePrice,
        user_id: userId
      })

      localStorage.setItem('customer_info_clickeagenda', JSON.stringify({ customerName, customerPhone }))
      toast.success("agendamento conlcuido com sucesso")
    } catch {
      toast.error('Erro ao criar agendamento. Tente novamente.')
    }
  }

  function formatPhone(value: string) {
      value = value.replace(/\D/g, '') // Remove tudo que não for número
   
      if (value.length <= 10) {
      // Formato para números fixos ou celulares antigos: (99) 9999-9999
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      } else {
      // Formato para celulares atuais: (99) 99999-9999
      return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      }
  }


  function unmaskPhone(value: string) {
   return value.replace(/\D/g, '') // Remove tudo que não for número
 }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <h2 className="text-xl font-semibold">Informações do Cliente</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} autoComplete="off" />
          </div>
          <div>
            <Label htmlFor="phone">Número de telefone (WhatsApp)</Label>
            
            <Input id="phone" 
                   value={formatPhone(customerPhone)}
                   onChange={(e) => {
                   const rawValue = unmaskPhone(e.target.value)
                   setCustomerPhone(rawValue)
               }}
               autoComplete="off"
            />
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Serviço: <strong>{selectedService?.name.split("-")[0] || parsed.name.split("-")[0]}</strong></p>
            <p className="text-sm text-muted-foreground">Valor: <strong>{BRLReais.format(Number(selectedService?.price || parsed.price))}</strong></p>
            <p className="text-xs text-muted-foreground">Pagamento será efetuado no momento do serviço</p>
          </div>
          <Button onClick={handleSchedule} className="w-full cursor-pointer">Agendar</Button>
          <Button onClick={() => router.back()} variant="outline" className="w-full cursor-pointer">Voltar</Button>

        </CardContent>
      </Card>
    </div>
  )
}
