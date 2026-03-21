"use client";

import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function signInWithCredentials(email: string, password: string) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered") === "1";
  const resetOk = searchParams.get("reset") === "1";
  const errorCode = searchParams.get("error") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(() => {
    if (!errorCode) return "";
    if (errorCode === "CredentialsSignin") return "Invalid email or password.";
    if (errorCode === "Configuration") return "Server auth is misconfigured.";
    return "Sign-in failed. Please try again.";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const em = email.trim().toLowerCase();
    const isDemo = em === "admin" && password === "admin";

    if (!isDemo) {
      if (!em) {
        setError("Enter your email or use the demo button below.");
        return;
      }
      if (!isValidEmail(em)) {
        setError("Enter a valid email, or use “admin” / “admin”.");
        return;
      }
      if (!password) {
        setError("Password is required.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await signInWithCredentials(isDemo ? "admin" : em, isDemo ? "admin" : password);

      if (!response.ok) {
        setError(pickErrorMessage(await response.json().catch(() => null)));
        setIsSubmitting(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function signInDemo() {
    setError("");
    setDemoLoading(true);
    try {
      const response = await signInWithCredentials("admin", "admin");
      if (!response.ok) {
        setError("Demo sign-in failed.");
        setDemoLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Demo sign-in failed.");
      setDemoLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {registered ? (
        <FadeIn delayMs={0}>
          <p className="text-sm text-center text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-xl py-3 px-4 font-sans">
            Account created. You can sign in now.
          </p>
        </FadeIn>
      ) : null}
      {resetOk ? (
        <FadeIn delayMs={0}>
          <p className="text-sm text-center text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-xl py-3 px-4 font-sans">
            Password updated. Sign in with your new password.
          </p>
        </FadeIn>
      ) : null}

      <div>
        <label className="block text-sm font-medium mb-2 text-gold-900/80 uppercase tracking-wide text-xs font-sans">
          Email
        </label>
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          placeholder="admin or you@example.com"
          className="h-12 bg-white/60 border-gold-200 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gold-900/80 uppercase tracking-wide text-xs font-sans">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="h-12 bg-white/60 border-gold-200 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>

      <ShimmerButton type="submit" disabled={isSubmitting} size="lg" className="h-12 text-lg font-medium">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </ShimmerButton>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm font-sans">
        <Link href="/auth/register" className="text-gold-800 hover:text-gold-950 underline-offset-4 hover:underline">
          Create an account
        </Link>
        <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>

      <div className="relative pt-4 border-t border-gold-100">
        <p className="text-center text-xs text-muted-foreground mb-3 font-sans uppercase tracking-wider">Demo</p>
        <Button
          type="button"
          variant="outline"
          disabled={demoLoading}
          onClick={signInDemo}
          className="w-full h-11 border-gold-200 bg-white/50 text-gold-900 hover:bg-gold-50/80"
        >
          {demoLoading ? "Entering dashboard…" : "Continue with demo — no typing needed"}
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600 text-center font-sans">{error}</p> : null}
    </form>
  );
}
