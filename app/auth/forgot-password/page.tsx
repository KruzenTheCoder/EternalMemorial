import { AuthShell } from "@/components/auth/auth-shell";
import { AuthTagline } from "@/components/auth/auth-tagline";
import { ImmersiveBackdrop } from "@/components/immersive/immersive-backdrop";
import { ForgotPasswordForm } from "./forgot-form";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <ImmersiveBackdrop variant="auth" className="h-full w-full" />
      </div>
      <AuthShell
        immersive
        eyebrow="Account help"
        title="Reset your password"
        description="We’ll email you a secure link. It expires in one hour."
      >
        <AuthTagline phrases={["A calm path back in.", "Safe, private, and quick.", "We’re here when you need us."]} className="mb-8" />
        <ForgotPasswordForm />
      </AuthShell>
    </div>
  );
}
