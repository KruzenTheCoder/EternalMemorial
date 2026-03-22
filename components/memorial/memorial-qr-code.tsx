"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";

export function MemorialQRCode({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `/${slug}`;

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        await QRCode.toCanvas(canvas, url, {
          width: 220,
          margin: 2,
          color: {
            dark: "#1c1917",
            light: "#fdfcfa",
          },
          errorCorrectionLevel: "H",
        });
        if (!cancelled) setReady(true);
      } catch (e) {
        console.error("QR generation failed", e);
      }
    }
    generate();
    return () => {
      cancelled = true;
    };
  }, [url]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${slug}-qr-code.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="luxury-card p-5 sm:p-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <QrCode className="w-4 h-4 text-gold-600" />
        <span className="font-medium text-foreground">QR Code</span>
      </div>

      <div className="relative rounded-xl border border-gold-200/60 bg-white p-3 shadow-inner">
        <canvas
          ref={canvasRef}
          className={`transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-[200px] leading-relaxed">
        Scan to visit {name}&apos;s memorial page. Perfect for printed
        programs.
      </p>

      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-gold-200 hover:bg-gold-50"
        onClick={download}
        disabled={!ready}
      >
        <Download className="w-3.5 h-3.5" /> Download PNG
      </Button>
    </div>
  );
}
