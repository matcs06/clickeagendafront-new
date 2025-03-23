"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/auth/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Edit } from "lucide-react";
import {toast} from "sonner";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {OrbitProgress} from "react-loading-indicators"
import { Trash } from "lucide-react"; // Certifique-se de instalar o pacote lucide-react
import UpdateServiceModal from "./modals/update-service-modal";
import CreateServiceModal from "./modals/create-service-modal";

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
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest("products"); // No need to append user_id
         // Assuming the response is an array of services
         setServices(response ?? []); // Fallback to empty array if response is undefined
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setLoading(false);
      }
    };

    
    fetchServices();
  }, [token, isOpen]);



  const fetchServices = async () => {
    try {
      const response = await apiRequest("products"); // No need to append user_id
       // Assuming the response is an array of services
       setServices(response ?? []); // Fallback to empty array if response is undefined

    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
  
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await apiRequest(`products/${id}`, { method: "DELETE" });
      toast.success("Serviço excluído com sucesso!", {
        duration: 3000,
      });
      fetchServices();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      toast.error("Erro ao excluir serviço.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Meus Serviços</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus size={16} /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="flex justify-center items-center">
            <DialogHeader>
              <DialogTitle>Criar Novo Serviço</DialogTitle>
            </DialogHeader>
            {/* Aqui vai o formulário de criação de serviço */}
            <CreateServiceModal onClose={() => setIsOpen(false)} onServiceCreated={fetchServices} />

          </DialogContent>
        </Dialog>
      </div>
      <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading == false && (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{service.name.split("-")[0]}</CardTitle>

                <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex gap-2 max-w-7 max-h-6 right-0 hover:bg-white hover:text-blue-800 bg-white text-black" >
                        <Edit size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex justify-center items-center">
                      <DialogHeader>
                        <DialogTitle>Atualizar Serviço</DialogTitle>
                      </DialogHeader>
                      {/* Aqui vai o formulário de atualizacao de serviço */}
                      <UpdateServiceModal onClose={() => setIsOpen(false)} onServiceCreated={fetchServices}   service={service} />
                    </DialogContent>
                  </Dialog>
               
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-grow min-h-9 max-h-20 justify-center items-center overflow-y-scroll">
                {service.description.split(";").map((descLine) => (
                              <p className="text-gray-600 whitespace-pre-line h-max" key={descLine}>
                                 {descLine}
                              </p>
                           ))}
                </div>
             
                <div className="flex justify-between items-center mt-auto border-t pt-2">
                  <p className="text-sm text-gray-500">R$ {service.price}</p>
                  <p className="text-sm text-gray-500">⏳ {service.duration} h</p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
                
              </CardContent>
               
            </Card>
            
          ))
          
        ) }
      </div>
      {loading &&
            <div className="flex justify-center items-center mt-14">
              <OrbitProgress dense color="#3d4e3d" size="small" text="" textColor="#7e4e4e" />          

            </div>
        }
    </div>
  );
}
