'use client'
 
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,

} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import Cookies from 'js-cookie'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from "react";
import { useTheme } from 'next-themes'
import api from '@/api/api'
import {  useQuery } from "@tanstack/react-query";
//import {  useQueryClient } from "@tanstack/react-query";
import { sumTime } from '@/lib/utils'
import { useAuth } from '@/app/auth/context/auth-context'
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

  const eventModal = createEventModalPlugin()
  const {refreshBeforeRequest} = useAuth()

  const { theme } = useTheme()
  const getFormattedMonthYear = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0') // garante dois dígitos
    const year = now.getFullYear()
    return `${month}/${year}`
  }
  
  const [callendarViewMonthYear, setCalendarViewMonthYear] = useState<string | null>(getFormattedMonthYear())
  //const queryClient = useQueryClient();

  const waitForModal = (callback: () => void) => {
    const check = () => {
      const modal = document.querySelector('.sx__event-modal.is-open')
  
      // Just wait until the modal is open and the WhatsApp button doesn't exist yet
      const whatsappAlreadyExists = modal?.querySelector('.whatsapp-button')
  
      if (modal && !whatsappAlreadyExists) {
        callback()
      } else {
        requestAnimationFrame(check)
      }
    }
  
    requestAnimationFrame(check)
  }
  

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
    plugins: [eventsService, eventModal],
    callbacks: {
      onSelectedDateUpdate(date) {
        setCalendarViewMonthYear(date.split("-").reverse().join("/").substring(3))
      },
      onEventClick: (event) => {
        console.log(event)
        waitForModal(() => {
          const modal = document.querySelector('.sx__event-modal.is-open')
    
          if (!modal) return
    
          // Prevent duplicate buttons
          if (modal.querySelector('.whatsapp-button')) return
    
          const phoneNumber = event.whatsappNumber || event.extendedProps?.whatsappNumber
          if (!phoneNumber) return
          const confirmationText = `${Cookies.get("business_name")}\nOlá, ${event.people}! Vamos confirmar seu agendamento? \n\n` +  
          `Serviço: ${event.title}\n` +
          `Data: ${event.date}\n` +
          `Horário: ${event.start_time.substring(0,5)}\n` +
          `Valor: R$ ${event.price}\n` +
          `Local: ${event.location ? event.location : "Sede empresa"} \n\n` +
          `Confirma?`

          const wpp_link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(confirmationText)}`

          const whatsappButton = document.createElement('a')
          whatsappButton.href = wpp_link
          whatsappButton.target = '_blank'
          whatsappButton.className = 'whatsapp-button'
          whatsappButton.textContent = 'Confirmar via WhatsApp'
          whatsappButton.style.cssText = `
            display: inline-block;
            margin-top: 12px;
            padding: 8px 16px;
            background-color: #25D366;
            color: white;
            border-radius: 4px;
            text-align: center;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
          `
    
          const valorDiv = document.createElement('div')
          valorDiv.className = 'sx__has-icon sx__event-modal__description'
          valorDiv.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sx__event-icon">
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="var(--sx-color-neutral-variant)" stroke-width="2"/>
              <circle cx="12" cy="12" r="2" stroke="var(--sx-color-neutral-variant)" stroke-width="2"/>
              <path d="M5 8V8.01" stroke="var(--sx-color-neutral-variant)" stroke-width="2" stroke-linecap="round"/>
              <path d="M5 16V16.01" stroke="var(--sx-color-neutral-variant)" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 8V8.01" stroke="var(--sx-color-neutral-variant)" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 16V16.01" stroke="var(--sx-color-neutral-variant)" stroke-width="2" stroke-linecap="round"/>
            </svg>
          R$ ${event.price || '---'}
          `

          // Append the button somewhere inside the modal
          modal.appendChild(valorDiv)
          modal.appendChild(whatsappButton)
        }) // Wait for DOM to render moda
      }
    }
    //events: formatedSchedules
  },
)

  const fetchSchedules = async (): Promise<Schedules[]> => {

    let token = Cookies.get("token");

    await refreshBeforeRequest(token)

    token = Cookies.get("token");
    
    const response = await api.get<Schedules[]>(`/schedules/bymonthandyear?schedule_date=${callendarViewMonthYear}`, 
      { headers: {Authorization: `Bearer ${token}`}, withCredentials:true})

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
          people: [schedule.customer_name],
          description: schedule.service,
          location: Cookies.get("address") ? Cookies.get("address") : "",
          whatsappNumber: schedule.phone_number,
          date: schedule.date,
          start_time: schedule.start_time,
          price: schedule.value,
        }
    
        return sc 
      })

      calendar?.events.set(formatedSchedules)
    }

  }, [schedules, calendar])


  
  const ctheme:"light" | "dark" = theme == "light" ? "light" : "dark"
  calendar?.setTheme(ctheme)

  return (
       <ScheduleXCalendar calendarApp={calendar} />
  )
}
 
export default CalendarApp