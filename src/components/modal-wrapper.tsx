// components/ModalWrapper.tsx
"use client";

import { useEffect } from "react";
import { PlanExpiredModal } from "./plan-expired-modal";
import { usePlanModal } from "@/app/auth/context/payment-context";

export default function ModalWrapper() {
  const { isPlanModalVisible, hidePlanModal, showPlanModal } = usePlanModal();

  useEffect(() => {
    const handler = () => showPlanModal();
    window.addEventListener("plan_expired_or_missing", handler);
    return () => window.removeEventListener("plan_expired_or_missing", handler);
  }, [showPlanModal]);

  return (
    <PlanExpiredModal open={isPlanModalVisible} onClose={hidePlanModal} />
  );
}
