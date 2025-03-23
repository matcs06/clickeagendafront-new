"use client"
import { Toaster } from "sonner";
export default function Home() {

  return (
    <div className="flex">
      <p>Bem vindo ao dashboard</p>
      <Toaster position="top-right" richColors />

    </div>
  );
}


