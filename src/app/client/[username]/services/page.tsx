'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams, useRouter } from "next/navigation";
import { Clock, Briefcase, Info } from 'lucide-react'
import { useService } from '@/app/auth/context/service-context'
interface IService {
  id: string
  name: string
  description: string
  price: string
  duration: string
  choosed_date:string
  choosed_time:string
  enabled:boolean
}

export default function ServicesPage() {
   const router = useRouter()
   const params = useParams()
   const username = params.username as string || ""
   const {setSelectedService} = useService()

  const fetchServices = async () => {
    const user_id = localStorage.getItem("ca_admin_user_id")
    const response = await api.get<IService[]>(`/products?user_id=${user_id}`, { withCredentials: true })
    return response.data.filter((service) => service.enabled)
  }

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  })

  const handleServiceClick = (service: IService) => {
    setSelectedService(service)
    localStorage.setItem('ca_selected_service', JSON.stringify(service))

    router.push(`/client/${username}/availability/`)
  }

 return (

  <>
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b shadow-sm px-4 pt-2 pb-2">
        <div className="max-w-md mx-auto flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-xl sm:text-2xl font-semibold">
              Nossos <span className="text-primary">Serviços</span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Confira as opções disponíveis para agendamento
          </p>
        </div>
      </div>
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 px-4 py-3 sm:px-6">

    <div className="max-w-md mx-auto space-y-6">
      {/* Header refinado */}
      
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {services?.map((service) => (
        <Card
          key={service.id}
          onClick={()=>handleServiceClick(service)}
          className="cursor-pointer rounded-2xl shadow-sm border border-border transition hover:shadow-md rounded-br-none rounded-tr-4xl"
        >
          <CardContent className="p-5 space-y-3">
            {/* Nome + preço em linha */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h2 className="text-lg font-semibold text-primary leading-tight">
                {service.name ? service?.name.split('-')[0] : "service name"}
              </h2>
              <span className="text-green-600 font-bold text-base sm:text-lg">
                R$ {Number(service.price).toFixed(2)}
              </span>
            </div>

            {/* Descrição */}
            <div className="flex items-start gap-2 text-muted-foreground text-sm">
              <Info size={16} className="mt-[2px]" />
              <p>{service.description}</p>
            </div>

            {/* Duração */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              <span>{service.duration}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {!isLoading && services?.length === 0 && (
        <p className="text-center text-muted-foreground">
          Nenhum serviço disponível no momento.
        </p>
      )}
    </div>
  </div>
  </>
)
}
