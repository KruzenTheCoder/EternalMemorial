"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className:
          "!bg-background !border !border-gold-200/60 !text-foreground !shadow-material-lg !rounded-xl !font-sans !text-sm",
        descriptionClassName: "!text-muted-foreground",
      }}
      richColors
      closeButton
      offset={20}
      gap={8}
    />
  );
}
