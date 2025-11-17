"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion-primitives/magnetic";

export function FloatingDownloadButton() {
  const onClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("optimum-download"));
    }
  };

  const springOptions = { bounce: 0.12 };

  return (
    <Magnetic
      intensity={0.25}
      springOptions={springOptions}
      actionArea="global"
      range={220}
    >
      <div className="fixed right-6 bottom-6 z-50">
        <Magnetic
          intensity={0.8}
          springOptions={springOptions}
          actionArea="global"
          range={120}
        >
          <Button
            variant="default"
            size="sm"
            className="inline-flex items-center gap-2 px-4 py-2 h-12 shadow-lg"
            onClick={onClick}
            aria-label="Download PDF"
          >
            <Magnetic
              intensity={0.2}
              springOptions={springOptions}
              actionArea="global"
              range={120}
            >
              <Download className="size-4" />
            </Magnetic>
            <Magnetic
              intensity={0.2}
              springOptions={springOptions}
              actionArea="global"
              range={120}
            >
              <span className="text-sm">Download PDF</span>
            </Magnetic>
          </Button>
        </Magnetic>
      </div>
    </Magnetic>
  );
}
