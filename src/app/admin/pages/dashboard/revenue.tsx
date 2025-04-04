import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

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

  const data = Object.entries(grouped).map(([date, value]) => ({ date, value }))
  return { data, total }

}

export default function RevenueChart({ schedules }: { schedules: ScheduleType[] | undefined }) {
   const { data, total } = getRevenueByDay(schedules)
 
   return (
     <div className="bg-white dark:bg-muted rounded-2xl p-4 shadow-sm">
       <div className="flex items-center justify-between mb-4">
         <h2 className="text-lg font-semibold">💰 Faturamento Estimado</h2>
         <span className="text-green-600 font-bold text-md">
           Total: R$ {total.toFixed(2)}
         </span>
       </div>
       <ResponsiveContainer width="100%" height={300}>
         <AreaChart data={data}>
           <defs>
             <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
               <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
             </linearGradient>
           </defs>
           <XAxis dataKey="date" />
           <YAxis />
           <CartesianGrid strokeDasharray="3 3" />
           <Tooltip formatter={(value) => `R$ ${value}`} />
           <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorValue)" />
         </AreaChart>
       </ResponsiveContainer>
     </div>
   )
 }
 
 