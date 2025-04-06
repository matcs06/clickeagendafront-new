'use client'

import api from "@/api/api"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation";
interface IFindUserByNameService {
   username: string;
   email: string;
   welcome_message: string;
   business_name: string;
   phone: string;
   address: string;
   id:string;
 }
 

export default function WelcomePage() {
  const router = useRouter()
  const params = useParams()
  const username = params.username as string || ""



  const handleScheduleClick = () => {
    
    router.push(`/client/${username}/services`)
  }

  const fetchUser = async () => {
    const response = await api.get<IFindUserByNameService>(`/users/${username}`, {withCredentials:true});
    localStorage.setItem("ca_admin_user_id", response.data.id || "")
    localStorage.setItem('ca_admin_info', JSON.stringify(response.data))
    return response.data ?? [];

  }

  const { data: user } = useQuery({
   queryKey: ["user"],
   queryFn: fetchUser, // ✅ Ensures async handling
 });
  


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 px-6 py-12 text-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
          Bem-vindo à <span className="text-purple-600">{user?.business_name}</span>
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          {user?.welcome_message}
        </p>

        <Button
          onClick={handleScheduleClick}
          className="cursor-pointer w-full py-6 text-lg font-semibold rounded-xl shadow-md"
        >
          Agendar horário
        </Button>
      </div>
    </div>
  )
}
