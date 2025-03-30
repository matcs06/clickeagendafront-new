"use client";

import api from "@/api/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Edit } from "lucide-react";
import {toast} from "sonner";
import {  useQuery } from "@tanstack/react-query";
import {  useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {OrbitProgress} from "react-loading-indicators"
import { Trash } from "lucide-react"; // Certifique-se de instalar o pacote lucide-react
import UpdateServiceModal from "./modals/update-service-modal";
import CreateServiceModal from "./modals/create-service-modal";
import { useAuth } from "@/app/auth/context/auth-context";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  enabled: boolean;
  diration: string;
}

export default function Services() {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const {refreshBeforeRequest} = useAuth()

  const fetchServices = async (): Promise<Service[] | undefined> => {
    console.log("entrou no fetch");
  
    try {
      let token = Cookies.get("token");
      const user_id = Cookies.get("user_id");
    
      await refreshBeforeRequest(token)

      token = Cookies.get("token");


      const response = await api.get(`/products?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      return response.data ?? []; // ✅ Always return an array
    } catch (error: any) {
      console.error("Error fetching service:", error.response?.data?.message);
      toast.error("Erro ao listar serviço.");
      throw error;
    }finally{
      setLoading(false)
    }
  };
  
  const { data: services, error, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices, // ✅ Ensures async handling
  });
  

  if (error) return toast.error("Erro ao buscar serviços.");

  const handleDeleteService = async (id: string) => {

    try {
      let token = Cookies.get("token");

      await refreshBeforeRequest(token)

      token = Cookies.get("token");

      if (!token) throw new Error("User not authenticated");

      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Ensures cookies are sent if needed
      });

      toast.success("Serviço excluído com sucesso!", {
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["services"] });
    } catch (error:any) {
        toast.error("Erro ao remover serviço.");
        console.error("Error removing service:", error.response.data.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10 border-b pb-5">
        <h3 className="text-xl font-semibold mr-7 text-foreground">Serviços</h3>
       <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2 cursor-pointer">
              <Plus size={16} /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="flex justify-center items-center">
            <DialogHeader>
              <DialogTitle>Criar Novo Serviço</DialogTitle>
            </DialogHeader>
            {/* Aqui vai o formulário de criação de serviço */}
            <CreateServiceModal onServiceCreated={()=>{queryClient.invalidateQueries({ queryKey: ["services"] })}} />

          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[200px]">
      {loading == false && (
          services?.map((service: Service) => (
            <Card key={service.id}   className={`hover:shadow-lg transition-shadow flex flex-col bg-background min-w-52 flex-grow ${
              !service.enabled ? "opacity-70 bg-muted" : "bg-background"
            }`}>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg font-semibold">{service.name.split("-")[0]}</CardTitle>

                <Dialog>
                    <DialogTrigger asChild>
                    <Button className="cursor-pointer flex gap-2 max-w-7 max-h-6 right-0 hover:bg-muted hover:text-primary bg-card text-foreground">
                      <Edit size={16} />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="flex justify-center items-center">
                      <DialogHeader>
                        <DialogTitle>Atualizar Serviço</DialogTitle>
                      </DialogHeader>
                      {/* Aqui vai o formulário de atualizacao de serviço */}
                      <UpdateServiceModal onServiceCreated={()=>{queryClient.invalidateQueries({ queryKey: ["services"] })}}   service={service} />
                    </DialogContent>
                  </Dialog>
               
              </CardHeader>
              <CardContent className="flex flex-col h-full">
              

                <div className="overflow-hidden overflow-y-scroll min-h-32 max-h-32 bg-muted px-3 pt-4 rounded-lg pb-2.5">
                    <p className="text-sm font-semibold text-muted-foreground whitespace-pre-line">
                        {service.description}
                    </p>
                </div>
             
                <div className="flex justify-between items-center mt-4 border-t pt-2">
                  <p className="text-sm text-muted-foreground mr-2.5">R$ {service.price}</p>
                  <p className="text-sm text-muted-foreground">⏳ {service.duration} h</p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
                    >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
                {/* Badge for Enabled/Disabled Status */}
                {!service.enabled && (
                  <div className="mt-2 text-center">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Dasabilitado
                    </span>
                  </div>
                )}
              </CardContent>
               
            </Card>
            
          ))
          
        ) }
      </div>
      {isLoading &&
            <div className="col-span-full flex justify-center">
              <OrbitProgress dense color="#3d4e3d" size="small" text="" textColor="#7e4e4e" />          

            </div>
        }
    </div>
  );
}


