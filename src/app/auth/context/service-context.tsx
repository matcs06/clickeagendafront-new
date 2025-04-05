// context/ServiceContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Service {
  id: string
  name: string
  description: string
  price: string
  duration: string
  choosed_date:string
  choosed_time:string
}

interface ServiceContextType {
  selectedService: Service | null
  setSelectedService: (service: Service | null) => void
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <ServiceContext.Provider value={{ selectedService, setSelectedService }}>
      {children}
    </ServiceContext.Provider>
  )
}

export function useService() {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider')
  }
  return context
}
