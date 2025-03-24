import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner"; // Import the toast library
import Cookies from "js-cookie";


interface CreateServiceModalProps {
  onServiceCreated: () => void;
}

export default function CreateServiceModal({ onServiceCreated }: CreateServiceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleCreateService = async () => {
    const newErrors: { [key: string]: boolean } = {
      name: !name,
      description: !description,
      price: !price,
      duration: !duration,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setLoading(true);
    try {
      const user_id = Cookies.get("user_id");
      const token = Cookies.get("token");
      
      await axios.post(
        "https://clickeagenda.arangal.com/products",
        { name: name + "-" + user_id, description, price, duration, user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Serviço criado com sucesso!", {
        duration: 3000,
      });
      onServiceCreated();
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Erro ao criar serviço.");

    } finally {
      setLoading(false);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 4) return;
    if (val.length > 2) {
      val = `${val.slice(0, 2)}:${val.slice(2)}`;
    }
    setDuration(val);
  };

  return (
    <DialogContent >
      <DialogHeader>
        <DialogTitle>Criar Novo Serviço</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Nome do serviço"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(errors.name && "border-red-500")}
          />
          {errors.name && <p className="text-red-500 text-sm">Campo obrigatório</p>}
        </div>
        
        <div>
          <Textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(errors.description && "border-red-500")}
          />
          {errors.description && <p className="text-red-500 text-sm">Campo obrigatório</p>}
        </div>
        
        <div className="flex gap-4">
          <div className="w-1/2">
            <Input
              type="number"
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={cn(errors.price && "border-red-500")}
            />
            {errors.price && <p className="text-red-500 text-sm">Campo obrigatório</p>}
          </div>
          <div className="w-1/2">
            <Input
              type="text"
              placeholder="Duração (hh:mm)"
              value={duration}
              onChange={handleDurationChange}
              className={cn(errors.duration && "border-red-500")}
            />
            {errors.duration && <p className="text-red-500 text-sm">Campo obrigatório</p>}
          </div>
        </div>
        
        <Button onClick={handleCreateService} disabled={loading} className="cursor-pointer w-full">
          {loading ? "Criando..." : "Criar Serviço"}
        </Button>
      </div>
    </DialogContent>
  );
}