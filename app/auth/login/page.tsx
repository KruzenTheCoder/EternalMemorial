import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthTagline } from "@/components/auth/auth-tagline";
import { ImmersiveBackdrop } from "@/components/immersive/immersive-backdrop";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <ImmersiveBackdrop variant="auth" className="h-full w-full" />
      </div>
      <AuthShell
        immersive
        eyebrow="Welcome back"
        title="Sign in"
        description="Manage memorials with quiet elegance."
      >
        <AuthTagline
          phrases={["Your stories, preserved.", "One gentle place for every memory.", "We’re glad you’re here."]}
          className="mb-8"
        />
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-gold-50/50" />}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </div>
  );
}
