"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function VirtualCandle({ memorialId }: { memorialId: string }) {
  const [isLit, setIsLit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onLight() {
    if (isLit || isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/memorials/${memorialId}/candles`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed");
      setIsLit(true);
      router.refresh();
    } catch {
      setError("Could not light a candle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onLight}
        className="relative cursor-pointer group"
      >
        <AnimatePresence>
          {isLit && (
            <motion.div
              key="glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-36 h-36 bg-gold-400/25 rounded-full blur-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="w-20 h-32 bg-gradient-to-b from-neutral-50 to-neutral-200 rounded-lg relative shadow-inner border border-white/40 overflow-hidden">
          <div className="absolute top-0 w-full h-4 bg-white/80 rounded-b-lg blur-[1px]" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-4 bg-neutral-800 rounded-sm" />
          <AnimatePresence>
            {isLit && (
              <motion.div
                key="flame"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 origin-bottom"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-gold-400/30 rounded-full blur-xl"
                />
                <motion.div
                  animate={{
                    scaleY: [1, 1.1, 0.95, 1.05, 1],
                    rotate: [-2, 2, -1, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div
                    className="w-6 h-10 bg-gradient-to-t from-orange-500 via-gold-400 to-white rounded-full blur-[1px] shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                    style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
                  />
                  <div
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-4 bg-blue-400/50 rounded-full blur-[2px]"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-28 h-3 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600 rounded-full mt-1 shadow-lg mx-auto" />
      </button>

      <motion.p
        className="text-gold-600/80 text-sm mt-6 font-serif tracking-widest uppercase"
        animate={{ opacity: isLit ? 0.6 : 1 }}
      >
        {isLit ? "Light has been given" : isSubmitting ? "Offering light..." : "Touch to light a candle"}
      </motion.p>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
