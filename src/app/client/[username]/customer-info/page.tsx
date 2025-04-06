'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import api from '@/api/api' // ajuste para seu caminho real
import { BRLReais } from '@/lib/utils' // ajuste se necessário
import { toast } from 'sonner'
import { useService } from '@/app/auth/context/service-context'
import Success from '../final-screen/page'
import { MaskedPhoneInput } from '@/components/ui/phone-input'

//import InputMask from 'react-input-mask'
interface IFindUserByNameService {
   business_name: string;
   phone: string;
   address: string;
 }

export default function CustomerInfo() {


  const router = useRouter()
  const {selectedService} = useService()

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)


  const [userInfo, setUserInfo] = useState<IFindUserByNameService>({
   address: "",
   business_name: "",
   phone: "",
  })
  let parsed:any;
  

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
        phone_number: removeNonNumbers(customerPhone),
        isMorning,
        price: servicePrice,
        user_id: userId
      })
      
      const stored = localStorage.getItem("ca_admin_info")

      let parsed;  
      if (stored) {
         parsed = JSON.parse(stored)
      } 
      console.log(parsed.phone)
      setUserInfo({address: parsed.address, business_name: parsed.business_name, phone: parsed.phone})
      setIsSuccess(true)

    } catch {
      toast.error('Erro ao criar agendamento. Tente novamente.')
    }
  }

  const removeNonNumbers = (value:string) =>{
   return value.replace(/\D/g, '');
  }

  return (
    <div className="max-w-md mx-auto p-4">
    
      {!isSuccess ? (
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
               
               <MaskedPhoneInput value={customerPhone} onChange={setCustomerPhone} />

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
      ):(
         <Success businessWhatsapp={userInfo.phone} 
         serviceAddress={userInfo.address} 
         serviceName={selectedService?.name.split("-")[0] || parsed.name.split("-")[0]}
         servicePrice={BRLReais.format(Number(selectedService?.price || parsed.price))}
         serviceTime={selectedService?.choosed_time ?? "00:00"}
         serviceDate={selectedService?.choosed_date ?? "01/01/2000"}
         />
      )}
    </div>
  )
}
