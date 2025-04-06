'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import api from '@/api/api'
import { getDateFromString, getWeekDayName, isTodayOrTomorrow, timeFormated } from '@/lib/date-utils'
import { toast } from 'sonner'
import { useService } from '@/app/auth/context/service-context'
import { useQuery } from '@tanstack/react-query'

interface AvailabilityFields {
  id: string
  username:string
  date: string
}

interface AvailabilityDetails {
  availability: AvailabilityFields
  morning_available_times: string[]
  afternoon_available_times: string[]
}

export default function ChooseTime() {
  const router = useRouter()
  const params = useParams()
  const username = params.username as string || ""
  const {selectedService, setSelectedService} = useService()
  
  const stored = localStorage.getItem('ca_selected_service')
  let parsed;  
  if (stored) {
      parsed = JSON.parse(stored)
  } 

  const serviceName = selectedService?.name.split('-')[0] || parsed.name.split('-')[0]
  const serviceDuration = selectedService?.duration

  const [timesAvailable, setTimesAvailable] = useState<AvailabilityDetails>()
  const [choosedDate, setChoosedDate] = useState('')
  const [choosedTime, setChoosedTime] = useState('')

  let duration = "00:00"
  
  
  function parseDate(dateStr: string): Date {
   const [day, month, year] = dateStr.split('/').map(Number)
   return new Date(year, month - 1, day) // mês é zero-based
 }

  const fetchAvailabilities = async()  =>  {

    console.log(selectedService)
   
    const user_id = localStorage.getItem("ca_admin_user_id")

    const today = new Date()
    today.setHours(0, 0, 0, 0) // zera o horário pra evitar erros de comparação


    const response = await api.get<AvailabilityFields[]>(`/availability/?user_id=${user_id}`)
    const filteredResponse = response.data.filter((availability: AvailabilityFields) => {
      const availabilityDate = parseDate(availability.date)
      return availabilityDate >= today
    })
   
    return (filteredResponse.sort((a, b) => getDateFromString(a.date).getTime() - getDateFromString(b.date).getTime()))
    
  }
  


  const { data: availabilities } = useQuery({
      queryKey: ['availabilities'],
      queryFn: fetchAvailabilities,
   })


  const onClickDay = async (id: string, date: string) => {
    if(!serviceDuration){
      const stored = localStorage.getItem('ca_selected_service')

      if (stored) {
        try {
           const parsed = JSON.parse(stored)
           duration = parsed?.duration
           console.log('Duration:', duration)
        } catch (err) {
           console.error('Erro ao fazer parse do localStorage:', err)
        }
      }
    }
    const fixedDuration = serviceDuration ? serviceDuration : duration
    setChoosedDate(date)
    const user_id = localStorage.getItem("ca_admin_user_id")
    try {
      const response = await api.get<AvailabilityDetails>(`/availability/details/${id}`, {
        params: { service_duration: fixedDuration , user_id: user_id },
      })
      setTimesAvailable(response.data)
    } catch  {
      toast.error('Erro ao carregar horários')
    }
  }

  const onClickTime = (time: string) => {
    if (time === 'X') return alert('Este horário não está disponível')
    setChoosedTime(time)
  }

  const handleContinue = () => {
   if (selectedService) {
      setSelectedService({ description: selectedService.description, name: selectedService.name, 
                           id: selectedService.id, price: selectedService.price, duration: selectedService.duration, choosed_date: choosedDate, choosed_time: choosedTime });
   }
   router.push(`/client/${username}/customer-info`)
  }

  return (
   <div className="flex flex-col justify-between min-h-screen px-4 py-6 bg-gradient-to-b from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
    <div className="max-w-xl mx-auto space-y-6 grow">
         <Card className="bg-background/60 backdrop-blur border shadow-sm">
            <CardHeader className="text-center">
               <h1 className="text-2xl font-bold text-primary">Agendamento</h1>
               {serviceName && (
                  <p className="text-sm text-muted-foreground italic">
                     Serviço: <span className="font-medium text-foreground">{serviceName}</span>
                  </p>
               )}
               {!choosedDate ? (
                  <p className="text-sm text-muted-foreground mt-1">
                     Escolha um dia 
                  </p>
               ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                     {getWeekDayName(choosedDate)}, {choosedDate}
                  </p>
               )}
            </CardHeader>
            <CardContent className='max-w-[calc(100vw/1.1)] overflow-x-auto'>
               {/* Scroll horizontal nos dias */}
               <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted rounded-md">
                  {availabilities?.map((day) => (
                  <Button
                     key={day.id}
                     variant={choosedDate === day.date ? 'default' : 'outline'}
                     onClick={() => onClickDay(day.id, day.date)}
                     className={`min-w-[90px] h-16 flex-shrink-0 flex flex-col text-xs items-center justify-center rounded-xl transition-all duration-200 ${
                        choosedDate === day.date ? 'border-primary shadow-md' : ''
                     }`}
                  >
                     <span>{isTodayOrTomorrow(day.date)}</span>
                     <span className="font-medium">{getWeekDayName(day.date)}</span>
                  </Button>
                  ))}
               </div>
            </CardContent>
         </Card>
        {timesAvailable && (
          <Card className="bg-background/60 backdrop-blur border shadow-sm">
            <CardHeader>
               {!choosedTime ? (
                  <h2 className="text-lg font-medium text-primary">
                  Escolha um horário
                </h2>
               ):(
                  <h2 className="text-lg font-medium text-primary flex justify-center ">
                      {choosedTime && `${choosedTime}`} 
                      {Number(choosedTime.split(":")[0]) > 1 ? " horas " : " hora"} 
                      {Number(choosedTime.split(":")[0]) >= 12 ? "da tarde": "da manhã"}
                  </h2>
               )}
              
            </CardHeader>
            <CardContent className="space-y-4 max-w-[calc(100vw/1.1)] overflow-x-auto">
              {timesAvailable.morning_available_times.length > 0 && (
                <>
                  <h3 className="text-sm text-muted-foreground">Manhã</h3>
                  <div className="flex flex-wrap gap-2">
                    {timesAvailable.morning_available_times.map((time) => (
                      <Button
                        key={time}
                        size="sm"
                        variant={choosedTime === timeFormated(time) ? 'default' : 'outline'}
                        className={choosedTime === timeFormated(time) ? 'ring-2 ring-primary ring-offset-1' : ''}
                        onClick={() => onClickTime(timeFormated(time))}
                     >
                        {timeFormated(time)}
                     </Button>
                    ))}
                  </div>
                </>
              )}
              {timesAvailable.afternoon_available_times.length > 0 && (
                <>
                  <Separator />
                  <h3 className="text-sm text-muted-foreground">Tarde</h3>
                  <div className="flex flex-wrap gap-2">
                    {timesAvailable.afternoon_available_times.map((time) => (
                      <Button
                        key={time}
                        size="sm"
                        variant={choosedTime === timeFormated(time) ? 'default' : 'outline'}
                        className={choosedTime === timeFormated(time) ? 'ring-2 ring-primary ring-offset-1' : ''}
                        onClick={() => onClickTime(timeFormated(time))}
                     >
                        {timeFormated(time)}
                     </Button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        
      </div>

       {/* Botões fixos no rodapé */}
       <div className="max-w-xl mx-auto w-80 pt-4 text-center">
            <Button className='w-full cursor-pointer' disabled={!choosedDate || !choosedTime} onClick={handleContinue}>
            Continuar
            </Button>
            <Button onClick={() => router.back()} variant="outline" className='w-full cursor-pointer mt-2'>
            Voltar
            </Button>
         </div>
    </div>
  )
}