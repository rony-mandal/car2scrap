import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { Sparkles } from "lucide-react";

export function StickyCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-30 md:w-auto pointer-events-none">
        <div className="pointer-events-auto md:max-w-xs">
          <Button
            variant="cta"
            size="lg"
            className="w-full md:w-auto shadow-elegant animate-pulse-soft"
            onClick={() => setOpen(true)}
          >
            <Sparkles className="h-4 w-4" />
            Get Best Price Now
          </Button>
        </div>
      </div>
      <LeadFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
