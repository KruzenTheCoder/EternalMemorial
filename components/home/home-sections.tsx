"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BRAND } from "@/lib/brand";
import {
  Heart,
  Shield,
  Globe,
  Clapperboard,
  ImageIcon,
  BookHeart,
  MessageCircle,
  Flame,
  Users,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 } as const,
  visible: { opacity: 1, y: 0 } as const,
};

const staggerVariants = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: { opacity: 1, y: 0 } as const,
};

export function HomeSections() {
  return (
    <>
      {/* ─── Social Proof Strip ─── */}
      <motion.section
        className="relative z-10 mt-20 sm:mt-28 w-full max-w-3xl mx-auto text-center"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gold-200/60 bg-white/60 backdrop-blur-md shadow-sm">
          <div className="flex -space-x-2">
            {["🕊️", "💐", "🕯️", "💝"].map((emoji, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-full bg-gold-50 border-2 border-white flex items-center justify-center text-sm"
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-sm text-foreground/80">
            <span className="font-semibold text-gold-800">Trusted by families</span>{" "}
            worldwide to preserve memories with dignity
          </p>
        </div>
      </motion.section>

      {/* ─── How It Works ─── */}
      <section className="relative z-10 mt-20 sm:mt-28 w-full max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-3 font-sans">
            How it works
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
            Three gentle steps
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-lg mx-auto font-serif italic">
            From a name to a living memorial, in minutes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              step: "01",
              title: "Create",
              desc: "Enter a name, dates, and an obituary. Upload photos and a cover image.",
              icon: BookHeart,
            },
            {
              step: "02",
              title: "Customize",
              desc: "Add service programs, events, a photo gallery, and live streaming.",
              icon: ImageIcon,
            },
            {
              step: "03",
              title: "Share",
              desc: "Publish and share the memorial link or QR code with family worldwide.",
              icon: Globe,
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="relative p-6 sm:p-8 rounded-2xl border border-gold-100/90 bg-white/70 backdrop-blur-sm text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold-100 border border-gold-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-gold-700" />
              </div>
              <span className="absolute top-4 right-5 text-3xl font-display text-gold-200/60 font-bold">
                {item.step}
              </span>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Feature Showcase ─── */}
      <section className="relative z-10 mt-24 sm:mt-32 w-full max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-3 font-sans">
            Everything you need
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
            A complete memorial platform
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              icon: Clapperboard,
              title: "Live Streaming",
              desc: "Broadcast funeral services worldwide with low-latency LiveKit streaming.",
              color: "text-red-500",
            },
            {
              icon: ImageIcon,
              title: "Photo Galleries",
              desc: "Curate an auto-playing slideshow of cherished memories and moments.",
              color: "text-sky-500",
            },
            {
              icon: MessageCircle,
              title: "Tributes & Moderation",
              desc: "Guests leave messages of comfort. You approve them before they appear.",
              color: "text-emerald-500",
            },
            {
              icon: Flame,
              title: "Virtual Candles",
              desc: "A gentle ritual — visitors light candles in honor of your loved one.",
              color: "text-amber-500",
            },
            {
              icon: Users,
              title: "Guest Book & RSVP",
              desc: "Digital guest book signatures and event RSVPs in one quiet place.",
              color: "text-violet-500",
            },
            {
              icon: Shield,
              title: "Private & Secure",
              desc: "Publish when you're ready. Your memorial, your control, always.",
              color: "text-gold-600",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="group relative p-6 rounded-2xl border border-gold-100/80 bg-white/60 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold-200/10 via-transparent to-amber-200/10"
              />
              <item.icon
                className={`w-8 h-8 mb-4 ${item.color} relative`}
              />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2 relative">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      <motion.section
        className="relative z-10 mt-24 sm:mt-32 w-full max-w-3xl mx-auto text-center"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="luxury-panel luxury-ring p-8 sm:p-12">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-gold-400 fill-gold-400"
              />
            ))}
          </div>
          <blockquote className="font-serif text-lg sm:text-xl text-foreground/90 leading-relaxed italic mb-6 max-w-xl mx-auto">
            &ldquo;We created Grandpa&apos;s memorial page in an evening.
            Family from three continents watched the service live and signed
            the guest book. It felt like everyone was in the same room.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-100 border border-gold-200/60 flex items-center justify-center text-sm font-display text-gold-800">
              S
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                Sarah M.
              </p>
              <p className="text-xs text-muted-foreground">
                Cape Town, South Africa
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── Pricing ─── */}
      <section className="relative z-10 mt-24 sm:mt-32 w-full max-w-3xl mx-auto text-center">
        <motion.div
          className="mb-10"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-600 mb-3 font-sans">
            Pricing
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
            Simple and transparent
          </h2>
          <p className="mt-3 text-muted-foreground text-sm font-serif italic max-w-md mx-auto">
            No hidden fees. No expiration. A memorial that lasts forever.
          </p>
        </motion.div>

        <motion.div
          className="luxury-panel luxury-ring p-8 sm:p-10 max-w-md mx-auto"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-gold-700/80 mb-2 font-sans">
            All Features Included
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-5xl font-display font-bold text-foreground">
              Free
            </span>
          </div>
          <ul className="space-y-3 text-left max-w-xs mx-auto mb-8">
            {[
              "Unlimited memorial pages",
              "Photo galleries & slideshows",
              "Live streaming with LiveKit",
              "Guest book & virtual candles",
              "Service program builder",
              "QR code generation",
              "Tribute moderation",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm text-foreground/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <ShimmerButton
            asChild
            size="lg"
            className="w-full font-medium"
          >
            <Link href="/auth/register" className="inline-flex w-full justify-center">
              Get started — it&apos;s free
            </Link>
          </ShimmerButton>
        </motion.div>
      </section>

      {/* ─── CTA ─── */}
      <motion.section
        className="relative z-10 mt-24 sm:mt-32 w-full max-w-3xl mx-auto text-center"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-gold-50 via-white to-amber-50/40 border border-gold-200/50 shadow-lg">
          <Heart className="w-10 h-10 text-gold-400 mx-auto mb-5" />
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-3">
            Every life deserves a beautiful story
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8 font-serif italic">
            Start building a memorial that brings comfort, connection, and
            lasting remembrance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <ShimmerButton
              asChild
              size="lg"
              className="px-8 font-medium"
            >
              <Link
                href="/auth/register"
                className="inline-flex justify-center gap-2"
              >
                Create a memorial <ArrowRight className="w-4 h-4" />
              </Link>
            </ShimmerButton>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-gold-300/80 text-gold-900 hover:bg-gold-50/90 px-8"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 mt-20 sm:mt-28 w-full max-w-6xl mx-auto border-t border-gold-200/40 pt-10 pb-8">
        <div className="grid sm:grid-cols-3 gap-8 text-sm px-2">
          <div>
            <p className="font-display font-semibold text-foreground mb-3">
              {BRAND.name}
            </p>
            <p className="text-muted-foreground leading-relaxed text-xs">
              {BRAND.description}
            </p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Product
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-gold-700 transition-colors"
                >
                  Create Memorial
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-gold-700 transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-gold-700 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Support
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href={`mailto:${BRAND.supportEmail}`}
                  className="hover:text-gold-700 transition-colors"
                >
                  {BRAND.supportEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gold-200/30 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </footer>
    </>
  );
}
