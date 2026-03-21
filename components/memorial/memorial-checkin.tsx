"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckInFormData = {
  name: string;
  email?: string;
};

export function CheckinForm({ memorialId }: { memorialId: string }) {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<CheckInFormData>();
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: CheckInFormData) => {
    try {
      setError("");
      setIsSubmitting(true);
      const response = await fetch(`/api/memorials/${memorialId}/checkins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Could not check in");
      setSuccess(true);
      reset();
      router.refresh();
    } catch {
      setError("Could not submit check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-300/50 bg-emerald-50/80 dark:bg-emerald-950/30 px-5 py-4 text-center text-emerald-700 dark:text-emerald-200 font-serif">
        ✓ Checked in successfully
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-sm mx-auto text-left">
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.25em] text-gold-700/70">Full Name</label>
        <Input {...register("name")} placeholder="Enter full name" required className="h-11 border-gold-200/70 bg-white/90 dark:bg-black/20" />
      </div>
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.25em] text-gold-700/70">Email</label>
        <Input {...register("email")} type="email" placeholder="Enter email address" className="h-11 border-gold-200/70 bg-white/90 dark:bg-black/20" />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Sign Guest Book"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
