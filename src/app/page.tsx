"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";

const steps = [
  { title: "1. Cadastre seus serviços", gif: "/gifs/servicos.gif" },
  { title: "2. Defina seu horário de disponibilidade", gif: "/gifs/horarios.gif" },
  { title: "3. Compartilhe o link", gif: "/gifs/link.gif" },
  { title: "4. Receba agendamentos", gif: "/gifs/agendamentos.gif" },
];

export default function LandingPage() {
  const router = useRouter();
  const [selectedGif, setSelectedGif] = useState(steps[0].gif);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="flex justify-center mb-4">
          <Image width={100} height={300} src="/logo_color2.png" alt="Logo" /> {/* Substitua /logo.png com o caminho do seu logo */}
        </div>
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Bem Vindo ao</h1>
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight  text-yellow-300">Click&Agenda</h1>
        </div>
        
        <h2 className="text-2xl font-medium mb-4">Organize seus agendamentos com facilidade</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">Sistema completo para profissionais autônomos. Simples, prático e eficiente.</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push("/signin")}
            className="text-lg px-6 py-4 rounded-2xl cursor-pointer bg-white text-indigo-600 hover:bg-gray-100"
          >
            Cadastrar
          </Button>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="text-lg px-6 py-4 rounded-2xl cursor-pointer bg-white text-indigo-600 hover:bg-gray-100"
          >
            Login
          </Button>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Como funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white border justify-center items-center border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
              onClick={() => setSelectedGif(step.gif)}
            >
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <video className="rounded-xl shadow-lg mx-auto" src={selectedGif} controls autoPlay loop muted width="600" />
        </div>
      </section>

      {/* Plano */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Plano Simples</h2>
        <Card className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl">
          <CardContent>
            <h3 className="text-5xl font-bold mb-4 text-indigo-600">R$ 49,99/mês</h3>
            <p className="mb-6 text-gray-700">Tudo que você precisa para agendar com seus clientes.</p>
            <ul className="text-left mb-8 space-y-3 text-gray-800">
              <li>✔ Agendamentos ilimitados</li>
              <li>✔ Link personalizado</li>
              <li>✔ Dashboard de métricas</li>
              <li>✔ Suporte prioritário</li>
            </ul>
            <Button onClick={() => router.push("/signin")} className="w-full py-4 text-lg rounded-2xl cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700">
              Assinar agora
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="1">
            <AccordionTrigger>Posso cancelar quando quiser?</AccordionTrigger>
            <AccordionContent>Sim! O cancelamento é simples e pode ser feito a qualquer momento.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>O que acontece após os 30 dias grátis?</AccordionTrigger>
            <AccordionContent>Você poderá escolher o plano de R$ 49,99/mês para continuar usando o sistema.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Click&Agenda. Todos os direitos reservados.
      </footer>
    </div>
  );
}
