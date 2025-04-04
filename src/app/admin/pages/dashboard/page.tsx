"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { CalendarDays, Activity, Clock } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useAuth } from "@/app/auth/context/auth-context"
import api from "@/api/api"
import RevenueChart from "./revenue"
import { useState } from "react"
import { parse } from "date-fns";

interface Schedules {
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


const months = [
   { value: "01", label: "Janeiro" },
   { value: "02", label: "Fevereiro" },
   { value: "03", label: "Março" },
   { value: "04", label: "Abril" },
   { value: "05", label: "Maio" },
   { value: "06", label: "Junho" },
   { value: "07", label: "Julho" },
   { value: "08", label: "Agosto" },
   { value: "09", label: "Setembro" },
   { value: "10", label: "Outubro" },
   { value: "11", label: "Novembro" },
   { value: "12", label: "Dezembro" },
 ]
 
 const years = ["2024", "2025", "2026"] // você pode gerar isso dinamicamente depois
 

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]

export default function Dashboard() {
   const [scheduleFilter, setScheduleFilter] = useState<"monthly" | "anual" | "all">("monthly")
   const [month, setMonth] = useState("01")
   const [year, setYear] = useState("2024")
   const {refreshBeforeRequest} = useAuth()

   const fetchSchedules = async (): Promise<Schedules[]> => {

      let token = Cookies.get("token");
      const user_id = Cookies.get("user_id");
      await refreshBeforeRequest(token)

      token = Cookies.get("token");
      
      const response = await api.get<Schedules[]>(`/schedules?user_id=${user_id}`, 
         { headers: {Authorization: `Bearer ${token}`}, withCredentials:true})

      return response.data ? response.data : []
   
   }
  
   const { data: schedules } = useQuery({
   queryKey: ["schedules"],
   queryFn: fetchSchedules, // ✅ Ensures async handling
   });  

   const filteredSchedules = schedules?.filter((schedule) => {
      const scheduleDate = schedule.date
      const scheduleYear = scheduleDate.split("/")[2]
      const scheduleMonth = scheduleDate.split("/")[1]
      if(scheduleFilter === "monthly"){
         return `${scheduleMonth}/${scheduleYear}` == `${month}/${year}`
      }else if(scheduleFilter === "anual"){
         return scheduleYear == year
      }else{
         return schedule
      }
   })

   const schedulesStats = {
      totalAppointments: filteredSchedules?.length,
      avgPerDay: (filteredSchedules ? filteredSchedules.length / 30 : 0).toPrecision(2),
      hoursWorked: filteredSchedules?.reduce((acc, schedule) => acc + parseInt(schedule.service_duration), 0),
   }

   const serviceDistribution = filteredSchedules?.reduce((acc, schedule) => {
      const service = schedule.service;
      const existingService = acc.find((s) => s.service === service);
      if (existingService) {
         existingService.value += 1;
      } else {
         acc.push({ service, value: 1 });
      }
      return acc;
   }, [] as { service: string; value: number }[]);

   const appointmentsPerDayData = filteredSchedules?.reduce((acc, schedule) => {
      
      const date = parse(schedule.date, "dd/MM/yyyy", new Date());
      
      const day = date.toLocaleString('pt-BR', { weekday: 'short' });
      const existingDay = acc.find((d) => d.day === day);
      if (existingDay) {
         existingDay.count += 1;
      } else {
         acc.push({ day, count: 1 });
      }
      return acc;
   }, [] as { day: string; count: number }[]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-2">
         <label htmlFor="filter" className="text-sm text-muted-foreground">
            Visualizar:
         </label>
      <select
        id="filter-type"
        className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none mr-6 "
        value={scheduleFilter}
        onChange={(e) => setScheduleFilter(e.target.value as "monthly" | "anual" | "all")}
      >
        <option value="monthly">Agendamentos Mensais</option>
        <option value="anual">Agendamentos Anuais</option>
        <option value="all">Todos os Agendamentos</option>
      </select>

      {scheduleFilter === "monthly" && (
        <>
          <label htmlFor="month" className="text-sm text-muted-foreground">
            Mês:
          </label>
          <select
            id="month"
            className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <label htmlFor="year" className="text-sm text-muted-foreground">
            Ano:
          </label>
          <select
            id="year"
            className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </>
      )}

      {scheduleFilter === "anual" && (
        <>
          <label htmlFor="year" className="text-sm text-muted-foreground">
            Ano:
          </label>
          <select
            id="year"
            className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </>
      )}
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <CalendarDays className="text-primary w-6 h-6" />
            <div>
              <p className="text-sm text-muted-foreground">Quantidade de agendamentos</p>
              <p className="text-lg font-semibold">{schedulesStats.totalAppointments}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Activity className="text-primary w-6 h-6" />
            <div>
              <p className="text-sm text-muted-foreground">Média por dia</p>
              <p className="text-lg font-semibold">{schedulesStats.avgPerDay}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Clock className="text-primary w-6 h-6" />
            <div>
              <p className="text-sm text-muted-foreground">Horas trabalhadas</p>
              <p className="text-lg font-semibold">{schedulesStats.hoursWorked}h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-2">Agendamentos por dia</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsPerDayData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <RevenueChart schedules={filteredSchedules} />

        <Card className="min-w-lvh">
          <CardContent className="p-4 min-w-auto w-full">
            <h2 className="text-lg font-medium mb-2">Distribuição de serviços</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  dataKey="value"
                  nameKey="service"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {serviceDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
