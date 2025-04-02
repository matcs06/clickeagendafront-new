"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/app/auth/context/auth-context";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import Cookies from "js-cookie";
import api from "@/api/api";

interface User{
  business_name:string;
  welcome_message:string;
  phone:string;
  address: string;
}

export default function CompleteProfileModal() {
  const {updateInfo} = useAuth()
  const [form, setForm] = useState({
    business_name: "",
    phone: "",
    address: "",
    welcome_message: "",
  });
  const {openAddInfo, setOpenAddInfo, refreshBeforeRequest} = useAuth()
  useEffect(() => {
    // Check if business_name and phone are missing
    if(Cookies.get("business_name") == null || Cookies.get("phone") == null){
      setOpenAddInfo(true);
    }

    const fetchUserinfo = async() =>{
      const username = Cookies.get("user_name")
  
      try {
  
        let token = Cookies.get("token");
        await refreshBeforeRequest(token)
        token = Cookies.get("token");
  
        const response = await api.get<User>(`/users/${username}`,   { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
  
        setForm({address:response.data.address,business_name: response.data.business_name, phone: response.data.phone, welcome_message: response.data.welcome_message })
        Cookies.set("business_name", response.data.business_name)
        Cookies.set("phone", response.data.phone)
      } catch {
        
      }
  
    }

    fetchUserinfo()

    return () => {}
  }, [openAddInfo]);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Aplica máscara de telefone (formato: (99) 99999-9999)
      const maskedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
      setForm({ ...form, [name]: maskedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    // Enviar os dados para a API
    try {

      const success = await updateInfo(form.business_name,form.phone, form.address, form.welcome_message)
      if(success){
        setOpenAddInfo(false)
      }
      toast.success("Informações adicionais atualizadas!")
    } catch {
      toast.error("Erro ao atualizar informacoes adicionais")
    }

    // Fechar modal e redirecionar
  };

  const handleClose = () => {
    setOpenAddInfo(false)
  };

  return (
    <Dialog open={openAddInfo} onOpenChange={setOpenAddInfo} >
        <DialogContent className="p-6 max-w-md rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Complete seu Perfil</DialogTitle>
          <DialogClose className="text-primary hover:text-red-500" onClick={handleClose} />
        </DialogHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-primary font-medium">Nome da Empresa</Label>
              <Input
                className="mt-1 text-primary"
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="text-primary">Telefone</Label>
              <Input
                className="mt-1 text-primary"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength={15}
              />
            </div>
            <div>
              <Label className="mt-1 text-primary">Endereço</Label>
              <Input
                className="text-primary"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-primary">Mensagem de Boas-Vindas para o seu Cliente</Label>
              <Textarea
                className="mt-1 text-primary focus:ring"
                name="welcome_message"
                value={form.welcome_message}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" onClick={handleClose}>
              Salvar e Continuar
            </Button>
          </form>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
