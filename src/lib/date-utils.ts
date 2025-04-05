export const timeFormated = (timeValue: string = "01:00") => {

   if (timeValue === "" || timeValue == undefined) {
      return ''
   } else {
      const timeForm = timeValue.split(":")
      if (timeValue.split(" ")[1] == "indisponível") {
         return "❌"
      }
      if (timeForm[0] == "") {
         return ""
      } else {
         return timeForm[0] + ":" + timeForm[1]

      }
   }



}

export const isTodayOrTomorrow = (someDate:string =  "01/01/20") => {

   if (someDate === "" || someDate == undefined) {
      return ""
   } else {

      const day = someDate.split('/')[0]
      const month = someDate.split('/')[1]
      const year = someDate.split('/')[2]
      const today = new Date()
      const sentDate = new Date(Number(year), Number(month) - 1, Number(day))

      if (sentDate.getDate() == today.getDate() &&
         sentDate.getMonth() == today.getMonth() &&
         sentDate.getFullYear() == today.getFullYear()) {
         return "Hoje"
      } else {

         if (sentDate.getDate() == today.getDate() + 1 &&
            sentDate.getMonth() == today.getMonth() &&
            sentDate.getFullYear() == today.getFullYear()) {
            return "Amanhã"
         } else {
            return someDate
         }
      }
   }

}

export const getWeekDayName = (dateValue: string = "01/01/2020") => {

   const days = new Array(7);
   days[0] = "Domingo";
   days[1] = "Segunda Feira";
   days[2] = "Terça Feira";
   days[3] = "Quarta Feira";
   days[4] = "Quinta Feira";
   days[5] = "Sexta Feira";
   days[6] = "Sábado";

   if (dateValue === "") {
      return ""
   } else {
      const day = dateValue.split('/')[0]
      const month = dateValue.split('/')[1]
      const year = dateValue.split('/')[2]
      const date = new Date(Number(year), Number(month) - 1, Number(day))

      return days[date.getDay()]

   }


}

export const getDateFromString = (someDate: string = "01/01/2020") => {

   const day = someDate.split('/')[0]
   const month = someDate.split('/')[1]
   const year = someDate.split('/')[2]
   const sentDate = new Date(Number(year), Number(month) - 1, Number(day))


   return sentDate

}