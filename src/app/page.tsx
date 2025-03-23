"use client"
import Sidebar from "@/components/ui/sidebar";
import { useState } from "react";
import Services from "./pages/services/page";
export default function Home() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  return (
    <div className="flex">
      <Sidebar setSelectedPage={setSelectedPage} />
      <main className="flex-1 p-6">
        {selectedPage === "dashboard" && <p>Bem-vindo ao painel!</p>}
        {selectedPage === "services" && <Services />}

      </main>
    </div>
  );
}


