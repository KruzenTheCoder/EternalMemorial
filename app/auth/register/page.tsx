import { AuthShell } from "@/components/auth/auth-shell";
import { AuthTagline } from "@/components/auth/auth-tagline";
import { ImmersiveBackdrop } from "@/components/immersive/immersive-backdrop";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <ImmersiveBackdrop variant="auth" className="h-full w-full" />
      </div>
      <AuthShell
        immersive
        eyebrow="Join us"
        title="Create your account"
        description="Build and care for memorials in one trusted place."
      >
        <AuthTagline
          phrases={["Begin with a name and a story.", "We’ll guard every detail with care.", "Your memorials, your sanctuary."]}
          className="mb-8"
        />
        <RegisterForm />
      </AuthShell>
    </div>
  );
}
