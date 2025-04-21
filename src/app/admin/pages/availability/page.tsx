"use client";

import api from "@/api/api";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrbitProgress } from "react-loading-indicators";
import CreateAvailabilityModal from "./modals/create-availability-modal";
import { timeFormated } from "@/lib/utils";
import { useAuth } from "@/app/auth/context/auth-context";

interface Availability {
  id: string;
  date: string;
  morning_start_time: string;
  morning_end_time: string;
  afternoon_start_time: string;
  afternoon_end_time: string;
}

export default function Availabilities() {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const {refreshBeforeRequest} = useAuth()
  

  const fetchAvailabilities = async (): Promise<Availability[] | undefined> => {

    try {

      const user_id = Cookies.get("user_id");
     
      const response = await api.get<Availability[]>(`/availability?user_id=${user_id}`);

      return response.data ?? [];
    } catch  {
        toast.error("Erro ao listar Horários.");
    } finally {
      setLoading(false);
    }
  };

  const { data: availabilities, error, isLoading } = useQuery({
    queryKey: ["availabilities"],
    queryFn: fetchAvailabilities,
  });

  if (error) return toast.error("Erro ao buscar Horários.");

  const handleDeleteAvailability = async (id: string) => {

    try {
      let token = Cookies.get("token");
      await refreshBeforeRequest(token)
      token = Cookies.get("token");

      await api.delete(`/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success("Horário excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
    } catch (error:any) {
      if(error.response.data.message != "token_expired"){
        toast.error("Erro ao remover Horários.");
      }
      console.error("Error removing disponibilidates:", error.response.data.message);
    }
  };

  return (
    <div className="p-6 mt-3 ml-4 border-2 max-w-[80%] mx-auto rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-10 border-b pb-5">
        <h3 className="text-xl font-semibold mr-7 text-foreground">Horários</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={16} /> Novo Horário
            </Button>
          </DialogTrigger>
          <DialogContent className="flex justify-center items-center">
            <DialogHeader>
              <DialogTitle>Criar Novo Horário</DialogTitle>
            </DialogHeader>
            <CreateAvailabilityModal onAvailabilityCreated={() => queryClient.invalidateQueries({ queryKey: ["availabilities"] })} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[200px]">
        {!loading &&
          availabilities?.map((availability: Availability) => (
            <Card key={availability.id} className={`hover:shadow-lg transition-shadow flex flex-col bg-background min-w-52 max-w-3xs`}>
              <CardHeader>
                  <div className="text-center mb-2">
                     <p className="text-sm font-medium text-muted-foreground">
                        {new Date(availability.date.split("/").reverse().join("/")).toLocaleDateString("pt-BR", { weekday: "long" })}
                     </p>
                     <p className="text-md font-semibold">
                        {new Date(availability.date.split("/").reverse().join("/")).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        })}
                     </p>
                  </div>
               </CardHeader>
               <CardContent className="space-y-3 flex flex-col justify-between flex-grow">
                  {availability.morning_start_time && (
                     <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg ">
                        <span className="text-sm text-foreground font-medium flex-grow text-left">🌞 Manhã</span>
                        <span className="text-sm text-muted-foreground ml-3">
                        {timeFormated(availability.morning_start_time)} - {timeFormated(availability.morning_end_time)}
                        </span>
                     </div>
                  )}

                  {availability.afternoon_start_time && (
                     <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg">
                        <span className="text-sm text-foreground font-medium flex-grow text-left">🌙 Tarde</span>
                        <span className="text-sm text-muted-foreground ml-3">
                        {timeFormated(availability.afternoon_start_time)} - {timeFormated(availability.afternoon_end_time)}
                        </span>
                     </div>
                  )}

                  <div className="flex justify-between items-center mt-4 border-t pt-2">
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAvailability(availability.id)}
                        className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
                     >
                        <Trash className="h-5 w-5" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))}
      </div>

      {isLoading && (
        <div className="col-span-full flex justify-center">
          <OrbitProgress dense color="#3d4e3d" size="small" text="" textColor="#7e4e4e" />
        </div>
      )}
    </div>
  );
}
