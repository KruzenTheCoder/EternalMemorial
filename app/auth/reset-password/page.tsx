import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthTagline } from "@/components/auth/auth-tagline";
import { ImmersiveBackdrop } from "@/components/immersive/immersive-backdrop";
import { ResetPasswordForm } from "./reset-form";

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <ImmersiveBackdrop variant="auth" className="h-full w-full" />
      </div>
      <AuthShell
        immersive
        eyebrow="Almost there"
        title="Choose a new password"
        description="Pick something strong and memorable for you alone."
      >
        <AuthTagline phrases={["A fresh start.", "Your account stays protected.", "Welcome back, soon."]} className="mb-8" />
        <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-gold-50/50" />}>
          <ResetPasswordForm />
        </Suspense>
      </AuthShell>
    </div>
  );
}
