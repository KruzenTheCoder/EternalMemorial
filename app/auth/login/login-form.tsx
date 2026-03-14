"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("Invalid credentials. Use admin / admin.");
      setIsSubmitting(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium mb-2 text-gold-900/80 uppercase tracking-wide text-xs">Username</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          placeholder="admin"
          className="h-12 bg-white/50 border-gold-200 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gold-900/80 uppercase tracking-wide text-xs">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="admin"
          className="h-12 bg-white/50 border-gold-200 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-lg font-medium bg-gold-600 hover:bg-gold-700 text-white shadow-lg shadow-gold-600/20 transition-all duration-300"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

