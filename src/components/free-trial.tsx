"use client";
import {  useEffect, useState } from "react";
import { useAuth } from "@/app/auth/context/auth-context";

export function FreeTrialBannerWrapper() {
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);
   const {  getUserInfo } = useAuth();
  
   useEffect(() => { 
      const userInfo = getUserInfo();
      if (userInfo.stripeSubscriptionId == "free-trial") {
         const trialEndDate = userInfo.planExpiresAt;
         console.log("Trial end date:", trialEndDate);
         const trialEnd = trialEndDate;
         const today = new Date();
         const timeDiff = trialEnd ? trialEnd.getTime() - today.getTime() : 0;
         const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
         setTrialDaysRemaining(daysRemaining);
      }
      
   }, []);

return (
   <>
  {trialDaysRemaining !== null && trialDaysRemaining > 0 && (
    <div className="fixed z-50 bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 text-sm font-medium">
      <div className="flex items-center gap-2">
        <span>🎁</span>
        <span>
          Você está no período de teste gratuito: <strong>{trialDaysRemaining}</strong> dias restantes.
        </span>
      </div>
      <a
        href="/admin/pages/payment/plans"
        className="bg-black text-yellow-400 px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 hover:text-black transition"
      >
        Assinar agora
      </a>
    </div>
  )}
</>

);
}
