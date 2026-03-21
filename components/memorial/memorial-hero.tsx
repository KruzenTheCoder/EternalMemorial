"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Memorial } from "@prisma/client";
import { ShareBar } from "@/components/memorial/share-bar";

function yearOrBlank(date?: Date) {
  if (!date) return "";
  return new Date(date).getFullYear().toString();
}

export function MemorialHero({ memorial }: { memorial: Partial<Memorial> }) {
  return (
    <section className="relative min-h-[82dvh] sm:min-h-[88dvh] md:min-h-[92vh] flex items-center justify-center overflow-hidden">
      {memorial.coverImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={memorial.coverImage}
            alt="Cover"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/85" />
          <motion.div
            className="absolute -inset-x-10 top-20 h-56 bg-gradient-to-r from-transparent via-gold-400/20 to-transparent blur-3xl"
            animate={{ opacity: [0.25, 0.75, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gold-700/15 via-transparent to-gold-900/20" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      <div className="relative z-10 container mx-auto text-center text-white px-4 sm:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-sans text-xs md:text-sm uppercase text-gold-100/85 mb-6"
          >
            A Celebration of Life
          </motion.p>

          {memorial.profileImage && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-6 sm:mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-300 to-gold-600 p-1 shadow-[0_0_40px_rgba(212,175,55,0.5)] animate-glow-pulse">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-black/20 relative">
                  <Image
                    src={memorial.profileImage}
                    alt={memorial.firstName || "Profile"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <h1 className="font-display text-[clamp(2.25rem,9vw,5.5rem)] md:text-8xl font-bold mb-3 sm:mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gold-50 via-gold-200 to-gold-500 drop-shadow-[0_10px_40px_rgba(0,0,0,0.65)] px-1 leading-[1.05]">
            <span className="block sm:inline">{memorial.firstName}</span>{" "}
            <span className="block sm:inline">{memorial.lastName}</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-gold-100/85 font-serif text-base sm:text-xl md:text-2xl tracking-[0.12em] sm:tracking-[0.2em] uppercase my-3 sm:my-4 px-2">
            <span className="hidden sm:block h-[1px] w-12 md:w-16 bg-gradient-to-r from-transparent via-gold-300/80 to-transparent" />
            <span className="whitespace-nowrap">
              {yearOrBlank(memorial.dateOfBirth)} — {yearOrBlank(memorial.dateOfDeath)}
            </span>
            <span className="hidden sm:block h-[1px] w-12 md:w-16 bg-gradient-to-r from-transparent via-gold-300/80 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
            className="mt-8 max-w-2xl"
          >
            <p className="text-base sm:text-lg text-gold-50/80 italic font-serif leading-relaxed px-2">
              &quot;Those we love don&apos;t go away, they walk beside us every day.&quot;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="mt-10"
          >
            <ShareBar title={`In loving memory of ${memorial.firstName || ""} ${memorial.lastName || ""}`.trim()} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-200/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold-300 to-transparent" />
      </motion.div>
    </section>
  );
}
