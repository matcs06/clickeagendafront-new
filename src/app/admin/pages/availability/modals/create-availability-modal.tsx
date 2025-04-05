"use client";

import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { validateAfternoonTime, validateMorningTime } from "@/lib/utils";
import api from "@/api/api";
import { useAuth } from "@/app/auth/context/auth-context";

interface CreateAvailabilityModalProps {
  onAvailabilityCreated: () => void;
}

export default function CreateAvailabilityModal({ onAvailabilityCreated }: CreateAvailabilityModalProps) {
  
  const addZero = (value:any) => {

    if (value < 10) {
       value = '0' + value;
    }
    return value;
  };

  const [morningStart, setMorningStart] = useState("");
  const [morningEnd, setMorningEnd] = useState("");
  const [afternoonStart, setafternoonStart] = useState("");
  const [afternoonEnd, setafternoonEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [picketDate, setPickedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  })
  const [formatedDate, setFormatedDate] = useState(()=>{
    const month = picketDate.getMonth() + 1; //months from 1-12
    const day = picketDate.getDate();
    const year = picketDate.getFullYear();
    return addZero(day) + "/" + addZero(month) + "/" + year;
  })

  const {refreshBeforeRequest} = useAuth()
  
  

  const handleCreateAvailability = async () => {

    setLoading(true);
    try {

        validateMorningTime(morningStart, morningEnd);
        validateAfternoonTime(afternoonStart, afternoonEnd)

        let token = Cookies.get("token");
  
        await refreshBeforeRequest(token)
  
        token = Cookies.get("token");

        let morning_start_time = ""
        let morning_end_time = ""
        let afternoon_start_time = ""
        let afternoon_end_time = ""

        if (morningStart) {
           morning_start_time = morningStart + ":00"
        }

        if (morningEnd) {
           morning_end_time = morningEnd + ":00"
        }

        if (afternoonStart) {
           afternoon_start_time = afternoonStart + ":00"
        }

        if (afternoonEnd) {
           afternoon_end_time = afternoonEnd + ":00"
        }

        await api.post("/availability/", {
           date: formatedDate,
           morning_start_time,
           morning_end_time,
           afternoon_start_time,
           afternoon_end_time,
        }, {
          withCredentials: true,
           headers: {
              Authorization: "Bearer " + token,
           },
        });
        toast.success(`Horário na data ${formatedDate} criado com sucesso`, {
          duration: 1000,
        });
        onAvailabilityCreated();
        setLoading(false)
     } catch(error:any) {
        if(error.response.data.message != "token_expired"){
          toast.error("Erro ao criar Horários.");
        }
        toast.error("Erro ao criar novo horário: Verifique se já não existe um horário na mesma data");
     }
  };


const handlePickedDate = (selectedDate: Date | undefined) => {
  if (!selectedDate) return;
  setPickedDate(selectedDate);
  setOpenCalendar(false);

  setFormatedDate(selectedDate.toLocaleDateString("pt-BR"));

};

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar Horário</DialogTitle>
      </DialogHeader>

      {/* Seletor de Data */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Data</label>
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                readOnly
                value={picketDate ? format(picketDate, "dd/MM/yyyy") : ""}
                placeholder="Selecione uma data"
                onClick={() => setOpenCalendar(!openCalendar)}
                className="cursor-pointer"
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                onClick={() => setOpenCalendar(!openCalendar)}
              >
                <CalendarIcon className="w-5 h-5" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={picketDate} onSelect={handlePickedDate} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Seção Morning */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Manhã</label>
        <div className="flex gap-4">
          <Input
            type="time"
            value={morningStart}
            onChange={(e) => setMorningStart(e.target.value)}
            placeholder="Início"
          />
          <Input
            type="time"
            value={morningEnd}
            onChange={(e) => setMorningEnd(e.target.value)}
            placeholder="Fim"
          />
        </div>
      </div>

      {/* Seção afternoon */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tarde</label>
        <div className="flex gap-4">
          <Input
            type="time"
            value={afternoonStart}
            onChange={(e) => setafternoonStart(e.target.value)}
            placeholder="Início"
          />
          <Input
            type="time"
            value={afternoonEnd}
            onChange={(e) => setafternoonEnd(e.target.value)}
            placeholder="Fim"
          />
        </div>
      </div>

      {/* Botão Criar */}
      <Button onClick={handleCreateAvailability} disabled={loading} className="w-full cursor-pointer">
        {loading ? "Criando..." : "Criar Horário"}
      </Button>
    </DialogContent>
  );
}
