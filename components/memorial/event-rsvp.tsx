"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  name: string;
  email: string;
  guestCount: string;
};

export function EventRsvp({ memorialId, eventId }: { memorialId: string; eventId: string }) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { guestCount: "1" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/memorials/${memorialId}/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          guestCount: Number(data.guestCount) || 1,
          status: "ATTENDING",
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError("Could not submit RSVP. Please check your details.");
        if (body?.error?.fieldErrors) setError("Please check the form.");
        return;
      }
      setDone(true);
      reset({ guestCount: "1" });
    } catch {
      setError("Could not submit RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <p className="text-sm text-emerald-700 dark:text-emerald-300 font-serif mt-3">
        Your RSVP has been recorded. Thank you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3 pt-4 border-t border-gold-200/40">
      <p className="text-xs uppercase tracking-[0.2em] text-gold-700/70">RSVP</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input {...register("name", { required: true })} placeholder="Full name" className="h-10 text-sm" />
        <Input {...register("email", { required: true })} type="email" placeholder="Email" className="h-10 text-sm" />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Guests (incl. you)</label>
          <Input {...register("guestCount")} type="number" min={1} max={20} className="h-10 text-sm mt-1" />
        </div>
        <Button type="submit" size="sm" disabled={isSubmitting} className="bg-gold-600 hover:bg-gold-700">
          {isSubmitting ? "Sending…" : "Confirm"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
