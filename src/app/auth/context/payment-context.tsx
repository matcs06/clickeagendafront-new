// app/context/PlanContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type PlanContextType = {
  showPlanModal: () => void;
  hidePlanModal: () => void;
  isPlanModalVisible: boolean;
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <PlanContext.Provider
      value={{
        isPlanModalVisible: isVisible,
        showPlanModal: () => setIsVisible(true),
        hidePlanModal: () => setIsVisible(false),
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanModal = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlanModal must be used within a PlanProvider");
  return context;
};
