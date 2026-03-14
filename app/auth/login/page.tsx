import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gold-50/20 px-4">
      <div className="max-w-md w-full luxury-card p-8 md:p-10 border border-gold-200 shadow-xl bg-white/90">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground font-serif italic">Sign in to manage your memorials</p>
        </div>

        <Suspense fallback={<div className="h-32" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
