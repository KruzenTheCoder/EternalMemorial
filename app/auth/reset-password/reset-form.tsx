"use client";

import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

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

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(pickErrorMessage(data));
        setIsSubmitting(false);
        return;
      }

      router.push("/auth/login?reset=1");
      router.refresh();
    } catch {
      setError("Reset failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center font-sans">
        <p className="text-sm text-muted-foreground">This link is missing a token. Open the link from your email, or request a new reset.</p>
        <Link href="/auth/forgot-password" className="inline-block text-gold-800 underline-offset-4 hover:underline text-sm font-medium">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2 text-gold-900/80 uppercase tracking-wide text-xs font-sans">New password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="h-12 bg-white/60 border-gold-200 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>

      <ShimmerButton type="submit" disabled={isSubmitting} size="lg" className="h-12 text-lg font-medium">
        {isSubmitting ? "Updating…" : "Save new password"}
      </ShimmerButton>

      <p className="text-center text-sm text-muted-foreground font-sans">
        <Link href="/auth/login" className="text-gold-800 underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>

      {error ? <p className="text-sm text-red-600 text-center font-sans">{error}</p> : null}
    </form>
  );
}
