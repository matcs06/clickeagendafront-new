// components/PlanExpiredModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlansPage from "@/app/admin/pages/payment/plans/page";
export function PlanExpiredModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escolha um plano</DialogTitle>
        </DialogHeader>
         <PlansPage/>
      </DialogContent>
    </Dialog>
  );
}
