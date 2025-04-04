import { Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart } from "recharts"

interface ScheduleType {
   id: string
     customer_name: string,
     phone_number: string,
     service: string,
     date: string,
     start_time: string,
     service_duration: string,
     value: string,
     price: string,
     isMorning: boolean,
     payment_status: string,
   user_id:string
}


function getRevenueByDay(schedules: ScheduleType[] | undefined) {
  const grouped: Record<string, number> = {}
  let total = 0

  schedules?.map((sched) => {
    const date = sched.date
    if (!grouped[date]) grouped[date] = 0
    grouped[date] += Number(sched.price) || 0
    total += Number(sched.price) || 0

  })

  const data = Object.entries(grouped)
  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
  .map(([date, value]) => ({ date, valor: value }))
  
  return { data, total }

}

export default function RevenueChart({ schedules }: { schedules: ScheduleType[] | undefined }) {
   const { data, total } = getRevenueByDay(schedules)
 
   return (
     <div className="bg-white dark:bg-muted rounded-2xl p-4 shadow-sm">
       <div className="flex items-center justify-between mb-4">
         <h2 className="text-lg font-semibold mt-3">💰 Faturamento Estimado</h2>
         <span className="text-green-600 font-bold text-md">
           Total: R$ {total.toFixed(2)}
         </span>
       </div>
       <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(str) => str.slice(0, 5)} />
          <YAxis />
          <Tooltip formatter={(valor) => `R$ ${valor}`} />
          <Area  type="monotone" dataKey="valor" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
        </ComposedChart>
      </ResponsiveContainer>
     </div>
   )
 }
 
 