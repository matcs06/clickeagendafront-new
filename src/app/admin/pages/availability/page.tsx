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

  const fetchAvailabilities = async () => {
    try {
      const token = Cookies.get("token");
      const user_id = Cookies.get("user_id");
      if (!token || !user_id) throw new Error("User not authenticated");

      const response = await api.get(`/availability?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return response.data ?? [];
    } catch (error) {
      console.error("Erro ao buscar disponibilidades:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const { data: availabilities, error, isLoading } = useQuery({
    queryKey: ["availabilities"],
    queryFn: fetchAvailabilities,
  });

  if (error) return toast.error("Erro ao buscar disponibilidades.");

  const handleDeleteAvailability = async (id: string) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("User not authenticated");

      await api.delete(`/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success("Disponibilidade excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
    } catch (error) {
      console.error("Erro ao excluir disponibilidade:", error);
      toast.error("Erro ao excluir disponibilidade.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10 border-b pb-5">
        <h3 className="text-xl font-semibold mr-7 text-foreground">Disponibilidades</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={16} /> Nova Disponibilidade
            </Button>
          </DialogTrigger>
          <DialogContent className="flex justify-center items-center">
            <DialogHeader>
              <DialogTitle>Criar Nova Disponibilidade</DialogTitle>
            </DialogHeader>
            <CreateAvailabilityModal onAvailabilityCreated={() => queryClient.invalidateQueries({ queryKey: ["availabilities"] })} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[200px]">
        {!loading &&
          availabilities.map((availability: Availability) => (
            <Card key={availability.id} className={`hover:shadow-lg transition-shadow flex flex-col bg-background`}>
              <CardHeader>
                  <div className="text-center mb-2">
                     <p className="text-sm font-medium text-muted-foreground">
                        {new Date(availability.date.split("/").reverse().join("-")).toLocaleDateString("pt-BR", { weekday: "long" })}
                     </p>
                     <p className="text-md font-semibold">
                        {new Date(availability.date.split("/").reverse().join("-")).toLocaleDateString("pt-BR", {
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
