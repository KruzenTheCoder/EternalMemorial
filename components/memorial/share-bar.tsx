"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const encodedUrl = useMemo(() => encodeURIComponent(url), [url]);
  const encodedText = useMemo(() => encodeURIComponent(title), [title]);

  const links = useMemo(
    () => [
      { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
      { label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
      { label: "WhatsApp", href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
      { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    ],
    [encodedText, encodedUrl]
  );

  const canNativeShare = typeof navigator !== "undefined" && Boolean(navigator.share);

  async function onCopy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
    }
  }

  async function onNativeShare() {
    if (!url) return;
    if (!navigator.share) return;

    try {
      await navigator.share({ title, text: title, url });
    } catch {
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="gap-2 bg-white/10 text-white border border-gold-200/30 hover:bg-white/15"
          onClick={onNativeShare}
          disabled={!url || !canNativeShare}
        >
          <Share2 className="w-4 h-4" /> Share
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="gap-2 bg-white/10 text-white border border-gold-200/30 hover:bg-white/15"
          onClick={onCopy}
          disabled={!url}
        >
          <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy link"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.25em] text-gold-100/85 border border-gold-200/30 bg-white/5 hover:bg-white/10 transition"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
