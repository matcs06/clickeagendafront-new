'use client'
 
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react'
import {
  CalendarEventExternal,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewWeek,

} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import Cookies from 'js-cookie'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import {createCurrentTimePlugin} from '@schedule-x/current-time'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from "react";
import { useTheme } from 'next-themes'
import api from '@/api/api'
import {  useQuery, useQueryClient } from "@tanstack/react-query";
//import {  useQueryClient } from "@tanstack/react-query";
import { sumTime } from '@/lib/utils'
import { useAuth } from '@/app/auth/context/auth-context'
import { toast } from 'sonner'
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

interface ExtendedCalendarEvent extends CalendarEventExternal {
  schedule_id: string
  
}

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const eventModal = createEventModalPlugin()
  const currentTimePlugin = createCurrentTimePlugin({
    fullWeekWidth: true,
    timeZoneOffset: -180,
  
  })
  const {refreshBeforeRequest} = useAuth()

  const { theme } = useTheme()
  const getFormattedMonthYear = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0') // garante dois dígitos
    const year = now.getFullYear()
    return `${month}/${year}`
  }
  
  const [callendarViewMonthYear, setCalendarViewMonthYear] = useState<string | null>(getFormattedMonthYear())
  const queryClient = useQueryClient();

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
      end: "23:00"
    },
    weekOptions:{
      gridHeight: 1200,
      eventWidth: 100,
    },
  
    isResponsive:false,
    locale:"pt-BR",
    defaultView: viewWeek.name,
    
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [eventsService, eventModal, currentTimePlugin],
    callbacks: {
      onSelectedDateUpdate(date) {
        setCalendarViewMonthYear(date.split("-").reverse().join("/").substring(3))
      },

      onEventClick: (event) => {
        waitForModal(() => {
          const modal = document.querySelector('.sx__event-modal.is-open')
    
          if (!modal) return
    
          // Prevent duplicate buttons
          if (modal.querySelector('.whatsapp-button')) return
    
          const phoneNumber = event.whatsappNumber || event.extendedProps?.whatsappNumber
          if (!phoneNumber) return
          const confirmationText = `${Cookies.get("business_name")}\nOlá, ${event.people}! Vamos confirmar seu agendamento? \n\n` +  
          `Serviço: ${event.title?.split("-")[0]}\n` +
          `Data: ${event.date}\n` +
          `Horário: ${event.start_time.substring(0,5)}\n` +
          `Valor: R$ ${event.price}\n` +
          `Local: ${event.location ? event.location : "Sede empresa"} \n\n` +
          `Confirma?`
          
          let wpp_link = `https://wa.me/+55${phoneNumber}?text=${encodeURIComponent(confirmationText)}`


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

          const buttonContainer = document.createElement('div')
          buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: space-between;
            align-items: space-between;
            margin-top: 12px;
            flex-wrap: wrap;
          `
          const whatsappButton = document.createElement('a')
          whatsappButton.href = wpp_link
          whatsappButton.target = '_blank'
          whatsappButton.className = 'whatsapp-button'
          whatsappButton.textContent = 'Confirmar via WhatsApp'
          whatsappButton.style.cssText = `
          padding: 8px 16px;
          background-color: transparent;
          color: #128C7E; /* dark green */
          border: 2px solid #128C7E;
          border-radius: 4px;
          text-align: center;
          text-decoration: none;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
        `

        whatsappButton.addEventListener("mouseenter", () => {
          whatsappButton.style.backgroundColor = "#e0f7ec"; // light green background on hover
        });
        whatsappButton.addEventListener("mouseleave", () => {
          whatsappButton.style.backgroundColor = "transparent";
        });

          const deleteButton = document.createElement('button')
          deleteButton.textContent = 'Cancelar'
          deleteButton.className = 'delete-button'
          deleteButton.style.cssText = `
          padding: 8px 16px;
          background-color: transparent;
          color: #c62828; /* dark red */
          border: 2px solid #c62828;
          border-radius: 4px;
          text-align: center;
          font-weight: bold;
          cursor: pointer;
          font-size: 12px;
        `
        deleteButton.addEventListener("mouseenter", () => {
          deleteButton.style.backgroundColor = "#fcebea"; // light red
        });
        deleteButton.addEventListener("mouseleave", () => {
          deleteButton.style.backgroundColor = "transparent";
        });
          
          deleteButton.addEventListener('click', async () => {
            const confirmDelete = confirm('Tem certeza que deseja excluir este agendamento?')
            
            if (confirmDelete) {
              try {
                let token = Cookies.get("token");
                refreshBeforeRequest(token)
                token = Cookies.get("token");

                const extendedEvent = event as ExtendedCalendarEvent

                await api.delete(`/schedules/${extendedEvent.schedule_id}`, {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                  },
                  withCredentials: true,
                })
                toast.success("Agendamento excluído com sucesso!", {
                  duration: 3000,
                })
                queryClient.invalidateQueries({ queryKey: ["schedules"] })
              } catch  {
                toast.error("Erro ao excluir agendamento.")
              } // assuming your event has an `id` field
            }
          })
          wpp_link = ""
          // Adiciona os botões no container
          buttonContainer.appendChild(whatsappButton)
          buttonContainer.appendChild(deleteButton)
          // Append the button somewhere inside the modal
          modal.appendChild(valorDiv)
          modal.appendChild(buttonContainer)
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
          title: schedule.service.split("-")[0],
          start: schedule.date.split("/").reverse().join("-") + " " + schedule.start_time.substring(0,5),
          end: schedule.date.split("/").reverse().join("-") + " " + sumTime(schedule.start_time, schedule.service_duration + ":00"),
          people: [schedule.customer_name],
          description: schedule.phone_number,
          whatsappNumber: schedule.phone_number,
          date: schedule.date,
          start_time: schedule.start_time,
          price: schedule.value,
          schedule_id: schedule.id,
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