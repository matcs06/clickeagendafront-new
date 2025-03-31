'use client'
 
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
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

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const { theme } = useTheme()
  const [currentView, setCurrentView] = useState(viewWeek.name);

  useEffect(() => {
   const handleResize = () => {
     if (window.innerWidth < 768) {
       setCurrentView(viewWeek.name); // Force week view on smaller screens
     }
   };
 
   window.addEventListener("resize", handleResize);
   return () => window.removeEventListener("resize", handleResize);
 }, []);


  const calendar = useNextCalendarApp({
   isResponsive:false,
    locale:"pt-BR",
    defaultView: currentView,
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-03-30 01:00',
        end: '2025-03-30 02:00',
      },
    ],
    plugins: [eventsService],
    callbacks: {
      onRender: () => {
        // get all events
        eventsService.getAll()
      }
    }
  })

  const ctheme:"light" | "dark" = theme == "light" ? "light" : "dark"

  calendar?.setTheme(ctheme)
 
  return (
      <ScheduleXCalendar calendarApp={calendar} />

  )
}
 
export default CalendarApp