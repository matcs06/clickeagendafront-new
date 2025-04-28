"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";

const steps = [
  { title: "1. Adicione informacoes do seu negócio", gif: "/gifs/configuracoes.gif" },
  { title: "2. Cadastre seus serviços", gif: "/gifs/servico.gif" },
  { title: "3. Defina seu horário", gif: "/gifs/horarios.gif" },
  { title: "4. Compartilhe o link", gif: "/gifs/linkdocliente.gif" },
  { title: "5. Receba agendamentos", gif: "/gifs/veragendamentos.gif" },
];

export default function LandingPage() {
  const router = useRouter();
  const [selectedGif, setSelectedGif] = useState(steps[0].gif);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-24 px-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
          <div className="flex items-center justify-center">
            <Image 
              width={200} 
              height={200} 
              src="/logo_color2.png" 
              alt="Logo" 
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
          <div className="flex flex-col items-center mb-1 md:items-start">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Bem-vindo ao</h1>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-yellow-300">
              Click&Agenda
            </h1>
          </div>
        </div>
        
        <h2 className="text-xl md:text-2xl font-medium mb-4">Organize seus agendamentos com facilidade</h2>
        <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Sistema completo para profissionais autônomos. Simples, prático e eficiente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button
            onClick={() => router.push("/signin")}
            className="text-base md:text-lg px-4 py-3 md:px-6 md:py-4 rounded-2xl cursor-pointer bg-white text-indigo-600 hover:bg-gray-100"
          >
            Cadastrar
          </Button>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="text-base md:text-lg px-4 py-3 md:px-6 md:py-4 rounded-2xl cursor-pointer bg-white text-indigo-600 hover:bg-gray-100"
          >
            Login
          </Button>
        </div>
      </section>


      {/* Rest of your components remain the same */}
      {/* Como Funciona */}
      <section className="py-12 md:py-20 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-2xl font-bold mb-8 md:mb-12">Como funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center"
              onClick={() => setSelectedGif(step.gif)}
            >
              <h3 className="text-sm md:text-base font-semibold">{step.title}</h3>
            </div>
          ))}
        </div>
        <div className="mt-8 md:mt-12 px-2">
          <Image
            width={600}
            height={600}
            src={selectedGif}
            className="rounded-sm shadow-lg mx-auto w-full max-w-md md:max-w-2xl border border-gray-200"
            alt="Demonstração"/>
        </div>
      </section>

      {/* Plano */}
      <section className="py-12 md:py-20 px-4 bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Plano Essencial</h2>
        <Card className="max-w-md mx-auto p-6 md:p-8 rounded-3xl shadow-2xl">
          <CardContent>
            <h3 className="text-3xl md:text-5xl font-bold mb-4 text-indigo-600">R$ 49,99/mês</h3>
            <p className="mb-6 text-gray-700 text-sm md:text-base">Tudo que você precisa para agendar com seus clientes.</p>
            <ul className="text-left mb-6 md:mb-8 space-y-2 md:space-y-3 text-sm md:text-base text-gray-800">
              <li>✔ Agendamentos ilimitados</li>
              <li>✔ Link personalizado para clientes</li>
              <li>✔ Dashboard de métricas:</li>
              <ul className="ml-6 space-y-1 list-disc">
                <li>• Quantidade de agendamentos</li>
                <li>• Serviço com mais retorno</li>
                <li>• Dia da semana com mais agendamentos</li>
                <li>• Faturamento estimado</li>
              </ul>
              <li>✔ Confirmação de agendamentos pelo WhatsApp</li>
              <li>✔ Suporte prioritário</li>
              <li>✔ Teste gratuito sem cartão</li>
            </ul>
            <Button onClick={() => router.push("/signin")} className="w-full py-3 md:py-4 text-base md:text-lg rounded-2xl cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700">
              Testar gratuitamente
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 px-4 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="1">
            <AccordionTrigger className="text-left">Posso cancelar quando quiser?</AccordionTrigger>
            <AccordionContent className="text-sm md:text-base">Sim! O cancelamento é simples e pode ser feito a qualquer momento.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger className="text-left">O que acontece após os 30 dias grátis?</AccordionTrigger>
            <AccordionContent className="text-sm md:text-base">Você poderá escolher o plano de R$ 49,99/mês para continuar usando o sistema.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-xs md:text-sm text-gray-600">
        © {new Date().getFullYear()} Click&Agenda. Todos os direitos reservados.
      </footer>
    </div>
  );
}