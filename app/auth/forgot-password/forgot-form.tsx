"use client";

import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";

function pickErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") return "Something went wrong.";
  const err = (data as { error?: unknown }).error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const o = err as { formErrors?: string[]; fieldErrors?: Record<string, string[] | undefined> };
    if (o.formErrors?.length) return o.formErrors[0];
    const first = Object.values(o.fieldErrors || {})
      .flat()
      .find((m) => typeof m === "string" && m.length);
    if (first) return first;
  }
  return "Something went wrong.";
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(pickErrorMessage(data));
        setIsSubmitting(false);
        return;
      }

      setMessage(typeof data?.message === "string" ? data.message : "Check your inbox for next steps.");
      setIsSubmitting(false);
    } catch {
      setError("Request failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2 text-gold-900/80 uppercase tracking-wide text-xs font-sans">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="h-12 bg-white/60 border-gold-200 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>

      <ShimmerButton type="submit" disabled={isSubmitting} size="lg" className="h-12 text-lg font-medium">
        {isSubmitting ? "Sending…" : "Send reset link"}
      </ShimmerButton>

      {message ? (
        <FadeIn delayMs={0}>
          <p className="text-sm text-center text-emerald-900 bg-emerald-50 border border-emerald-200/80 rounded-xl py-3 px-4 font-sans">{message}</p>
        </FadeIn>
      ) : null}

      <p className="text-center text-sm text-muted-foreground font-sans">
        <Link href="/auth/login" className="text-gold-800 underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>

      {error ? <p className="text-sm text-red-600 text-center font-sans">{error}</p> : null}
    </form>
  );
}
