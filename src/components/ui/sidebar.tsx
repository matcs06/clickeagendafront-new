/* eslint-disable @typescript-eslint/no-explicit-any */
import { Home, Workflow } from "lucide-react";

const Sidebar = ({ setSelectedPage }: { setSelectedPage: (page: string) => void }) => (
   <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
     <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
     <nav className="space-y-4">
       <SidebarButton onClick={() => setSelectedPage("dashboard")} icon={Home} label="Dashboard" />
       <SidebarButton onClick={() => setSelectedPage("services")} icon={Workflow} label="Serviços" /> 
     </nav>
   </aside>
 );

const SidebarButton = ({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label: string }) => (
   <button onClick={onClick} className="hover:cursor-pointer flex items-center space-x-2 p-2 w-full text-left">
      <Icon size={20} />
      <span>{label}</span>
   </button>
);

export default Sidebar;
