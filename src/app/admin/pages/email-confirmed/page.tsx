"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const EmailConfirmed = () => {

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Card className="max-w-md p-6 text-center">
        <CardHeader>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <CardTitle className="text-xl font-semibold mt-4">Email Confirmado!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Seu email foi confirmado com sucesso. Agora você pode escolher um plano para continuar.</p>
          <Button 
            className="mt-6 w-full cursor-pointer" 
            onClick={() => {}}
          >
            Escolher Plano
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmed;