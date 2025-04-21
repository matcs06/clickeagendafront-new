'use client'

import { useEffect, useState } from 'react'
import api from '@/api/api'
import { useAuth } from '@/app/auth/context/auth-context'
import Cookies from 'js-cookie'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrbitProgress } from 'react-loading-indicators'
import { toast } from 'sonner'

export default function MyPlanPage() {
  const { refreshBeforeRequest } = useAuth()

  const [data, setData] = useState<null | {
    plan: string
    amount: number
    currency: string
    invoice_url: string
    period_end: number
    status: string
    cancel_at_period_end: boolean
  }>(null)

  const [isCanceling, setIsCanceling] = useState(false)

  useEffect(() => {
    async function loadSubscription() {
      let token = Cookies.get('token')

      await refreshBeforeRequest(token)
      token = Cookies.get('token')

      if (!token) throw new Error('User not authenticated')

      api
        .get('/payments/user-subscription', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then(res => setData(res.data))
        .catch(() => setData(null))
    }

    loadSubscription()
  }, [])

  console.log('data', data)
  async function handleCancelSubscription() {
    if (!data || data.cancel_at_period_end) return
    setIsCanceling(true)

    try {
      const token = Cookies.get('token')
      await api.delete(
        '/payments/cancel-subscription',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      toast.success('Assinatura cancelada com sucesso.')
      setData(prev => prev ? { ...prev, cancel_at_period_end: true } : prev)
    } catch {
      toast.error('Erro ao cancelar assinatura.')
    } finally {
      setIsCanceling(false)
    }
  }

  if (!data)
    return (
      <div className="flex justify-center items-center w-full">
        <OrbitProgress dense color="#3d4e3d" size="small" text="" textColor="#7e4e4e" />
      </div>
    )

  const formattedPlan =
    data.plan === 'PRO' ? 'Profissional' :
    data.plan === 'STANDARD' ? 'Essencial' : 'Gratuito'

  return (
    <div className="p-6 max-w-4xl mx-auto bg-background rounded-lg shadow-md w-full ">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Informações do Plano</h1>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 grid gap-4">
            {!data.cancel_at_period_end && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <p className="text-muted-foreground text-sm">Plano atual</p>
                      <p className="text-lg font-medium">{formattedPlan}</p>                           
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Valor mensal</p>
                    <p className="text-lg font-medium">R${(data.amount / 100).toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm">Próxima cobrança</p>
                    <p className="text-lg font-medium">
                      {data.cancel_at_period_end
                        ? "Assinatura cancelada"
                        : new Date(data.period_end * 1000).toLocaleDateString("pt-BR", {
                          day: '2-digit',
                          month: 'long', // instead of '2-digit'
                          year: 'numeric',
                        })}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  {data.invoice_url && (
                    <a href={data.invoice_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" className="cursor-pointer">
                        Baixar Recibo
                      </Button>
                    </a>
                  )}
                  <Button
                    className="cursor-pointer"
                    onClick={handleCancelSubscription}
                    disabled={isCanceling || data.cancel_at_period_end}
                    variant="destructive"
                    size="sm"
                  >
                    {isCanceling ? "Cancelando..." : "Cancelar assinatura"}
                  </Button>
                </div>
              </>
            )}
            
            {data.cancel_at_period_end && (
                <div className="mt-4 p-4 border border-yellow-400 text-yellow-700 bg-yellow-50 rounded-lg text-sm">
                Sua assinatura foi cancelada, mas você ainda poderá usá-la até{' '}
                <span className="font-medium">
                    {new Date(data.period_end).toLocaleDateString("pt-BR", {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    })}
                </span>.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
