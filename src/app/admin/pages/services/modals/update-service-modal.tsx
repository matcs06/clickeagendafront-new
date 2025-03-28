import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Import a switch component (or use a checkbox)
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner"; // Import the toast library
import Cookies from "js-cookie";


interface UpdateServiceModalProps {
  service: { id: string; name: string; description: string; price: number; duration: string, enabled: boolean };
  onServiceCreated: () => void;

}

export default function UpdateServiceModal({ onServiceCreated, service }: UpdateServiceModalProps) {
  const [name, setName] = useState(service.name.split("-")[0]);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price.toString());
  const [duration, setDuration] = useState(service.duration);
  const [enabled, setIsEnabled] = useState(service.enabled);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleUpdateService = async () => {
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
      await axios.patch(
        "http://localhost:3333/products/" + service.id,
        { name: name + "-" + user_id, description, price, duration, user_id, enabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Serviço atualizado com sucesso!", {
        duration: 3000,
      });
      onServiceCreated();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating service:", error.response.data.message);
      toast.error("Erro ao atualizar serviço.");
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Atualizar Serviço</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Input
            title="Nome do serviço"
            placeholder="Nome do serviço"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(errors.name && "border-red-500")}
          />
          {errors.name && <p className="text-red-500 text-sm">Campo obrigatório</p>}
        </div>
        
        <div>
          <Textarea
            title="Descriçao"
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
            title="Preço"
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
              title="Duração"
              type="text"
              placeholder="Duração (hh:mm)"
              value={duration}
              onChange={handleDurationChange}
              className={cn(errors.duration && "border-red-500")}
            />
            {errors.duration && <p className="text-red-500 text-sm">Campo obrigatório</p>}
          </div>
        </div>
        {/* Add the enabled/disabled toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={enabled}
            className="cursor-pointer"
            onCheckedChange={(checked) => setIsEnabled(checked)}
          />
          <label htmlFor="enabled">{enabled ? "Habilitado" : "Desabilitado"}</label>
        </div>
        
        <Button onClick={handleUpdateService} disabled={loading} className="w-full cursor-pointer">
          {loading ? "Atualizando..." : "Atualizar Serviço"}
        </Button>
      </div>
    </DialogContent>
  );
}