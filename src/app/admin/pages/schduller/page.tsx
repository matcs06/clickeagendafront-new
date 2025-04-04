'use client'
 
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from "react";
import { useTheme } from 'next-themes'
import api from '@/api/api'
import {  useQuery } from "@tanstack/react-query";
//import {  useQueryClient } from "@tanstack/react-query";
import { sumTime } from '@/lib/utils'
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

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const { theme } = useTheme()
  //const queryClient = useQueryClient();

  const calendar = useNextCalendarApp({
    dayBoundaries:{
      start: "07:00",
      end: "22:00"
    },
    weekOptions:{
      gridHeight: 1200,
      eventWidth: 100,
    },
  
    isResponsive:false,
    locale:"pt-BR",
    defaultView: viewWeek.name,
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [eventsService],
    //events: formatedSchedules
  })

  const fetchSchedules = async (): Promise<Schedules[]> => {

    const user_id = "c83998ec-78ac-46d8-93cc-f22e3a0faa2c"
    const month_year = "04/2025"
    const response = await api.get<Schedules[]>(`/schedules/bymonthandyear?user_id=${user_id}&schedule_date=${month_year}`)

    return response.data ? response.data : []
  
  }

  const { data: schedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules, // ✅ Ensures async handling
  });

  useEffect(() => {
    if(schedules){
      const formatedSchedules = schedules?.map((schedule)=>{
        const sc = {
          id: schedule.id,
          title: schedule.service,
          start: schedule.date.split("/").reverse().join("-") + " " + schedule.start_time.substring(0,5),
          end: schedule.date.split("/").reverse().join("-") + " " + sumTime(schedule.start_time, schedule.service_duration + ":00"),
        }
    
        return sc 
      })

      calendar?.events.set(formatedSchedules)
    }
  }, [schedules])

  const ctheme:"light" | "dark" = theme == "light" ? "light" : "dark"
  calendar?.setTheme(ctheme)

  return (
       <ScheduleXCalendar calendarApp={calendar} />
  )
}
 
export default CalendarApp