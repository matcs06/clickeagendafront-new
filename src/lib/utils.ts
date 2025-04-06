import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateMorningTime = (from: any, to:any) => {

  if (from != undefined && to !== "") {
     if (from.split(":")[0] > 11) {
        throw new Error("Manhã deve ter pelo menos uma hora a menos do inicio da tarde")
     }

     if (from.split(":")[0] == 11 && from.split(":")[1] > 0) {
        throw new Error("Horário da manhã deve ter pelo menos uma hora")
     }
  }

  if (to != undefined && to !== "") {
     if (to.split(":")[0] > 12) {
        throw new Error("Tempo inválido para horário da manhã")
     }

     if (to.split(":")[0] == 12 && to.split(":")[1] > 0) {
        throw new Error("Tempo inválido para horário da manhã")
     }

  }

  if ((from != undefined && to != undefined) && ((from !== "" && to !== ""))) {

     if (from.split(":")[0] > to.split(":")[0]) {
        throw new Error("Horário final precisa ser maior que horário inicial")
     }
  }


}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateAfternoonTime = (from:any, to:any) => {

  if (from != undefined && from !== "") {
     if (from.split(":")[0] < 12) {
        throw new Error("Este horário não pertence à tarde")
     }
  }

  if ((from != undefined && to != undefined) && ((from != "" && to != "")) ) {

     if (from.split(":")[0] > to.split(":")[0]) {
        throw new Error("Horário final precisa ser menor que horário inicial")
     }
  }


}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const timeFormated = (timeValue: any) => {

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

export const sumTime = (time1:string, time2:string) => {
   const toMinutes = (time:any) => {
      const [hh, mm] = time.split(':').map(Number);
      return hh * 60 + mm;
  };

  const toHHMM = (minutes:any) => {
      const hh = Math.floor(minutes / 60);
      const mm = minutes % 60;
      return [hh, mm].map(num => String(num).padStart(2, '0')).join(':');
  };

  const totalMinutes = toMinutes(time1) + toMinutes(time2);
  return toHHMM(totalMinutes);
}

export const BRLReais = new Intl.NumberFormat("pt-br", {
   style: "currency",
   currency: "BRL"
})