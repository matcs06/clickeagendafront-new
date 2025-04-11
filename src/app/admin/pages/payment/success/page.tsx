'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/api/api'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {

      async function loadSubscription(){

         if (sessionId) {

            try {
               const response = await api.get(`/payments/confirm-subscription?session_id=${sessionId}`)

               const price = response.data?.items?.data[0]?.price
               const plan = (price?.metadata?.plan_name ?? "FREE") as "STANDARD" | "PRO" | "FREE"
               
               const planLabel = plan === "PRO" 
               ? "Profissional" 
               : plan === "STANDARD" 
                  ? "Essencial" 
                  : "Gratuito"
            
               setMessage(`Pagamento realizado com sucesso! Bem-vindo ao plano ${planLabel} 🎉`)
               console.log("Subscription received:", response.data)
               setSuccess(true)
               setLoading(false)
            } catch  {
               setMessage('Pagamento realizado, mas houve um problema ao confirmar. Entre em contato.')
               setSuccess(false)
            }

         } else {
            setMessage('Sessão inválida.')
            setSuccess(false)
            setLoading(false)
         }
      }

      loadSubscription()
        
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-accent px-4 transition-colors duration-300 w-full">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 max-w-md text-center text-gray-900 dark:text-gray-100">
        {success && !loading && (
          <h1 className="text-2xl font-bold mb-4">✅ Sucesso!</h1>
        )}
        {loading ? (
          <p>Confirmando sua assinatura...</p>
        ) : (
          <p>{message}</p>
        )}
        <Link href="/admin/pages/dashboard" className="mt-6 inline-block text-blue-600 dark:text-blue-400 underline">
          Voltar para o dashboard
        </Link>
      </div>
    </div>
  )
}
