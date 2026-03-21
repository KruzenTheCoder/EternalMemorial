"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  authorName: string;
  content: string;
};

export function TributeForm({ memorialId }: { memorialId: string }) {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/memorials/${memorialId}/tributes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: data.authorName.trim(),
          content: data.content.trim(),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(typeof body?.error === "string" ? body.error : "Could not send your message.");
        return;
      }
      setDone(true);
      reset();
      router.refresh();
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-gold-200/60 bg-gold-50/50 dark:bg-gold-950/20 px-5 py-4 text-center font-serif text-gold-900 dark:text-gold-100">
        Thank you. Your message will appear after the family reviews it.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg mx-auto text-left">
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.25em] text-gold-700/70">Your name</label>
        <Input
          {...register("authorName", { required: true })}
          placeholder="Name"
          className="h-11 border-gold-200/70 bg-white/90 dark:bg-black/20"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.25em] text-gold-700/70">Memory or condolence</label>
        <textarea
          {...register("content", { required: true })}
          rows={5}
          placeholder="Share a story, a kind word, or a prayer…"
          className="w-full rounded-md border border-gold-200/70 bg-white/90 dark:bg-black/20 px-3 py-2 text-sm resize-y min-h-[120px]"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Submit message"}
      </Button>
      {error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}
    </form>
  );
}
