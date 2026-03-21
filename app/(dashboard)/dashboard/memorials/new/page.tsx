"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";

export default function NewMemorialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      dateOfBirth: String(formData.get("dateOfBirth") || ""),
      dateOfDeath: String(formData.get("dateOfDeath") || ""),
      obituary: String(formData.get("obituary") || ""),
      profileImage,
      coverImage,
      streamKey: String(formData.get("streamKey") || ""),
      isStreaming: formData.get("isStreaming") === "on",
      isPublished: formData.get("isPublished") === "on",
    };

    try {
      const response = await fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body?.detail
            ? String(body.detail)
            : body?.error
              ? String(body.error)
              : `Request failed (${response.status})`;
        throw new Error(message);
      }

      const memorial = await response.json();
      router.push(`/dashboard/memorials/${memorial.id}/edit`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl px-4">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gold-700/80">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">Create a memorial</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          A calm, lasting place for obituaries, services, photos, and live gatherings.
        </p>
      </div>
      <form className="space-y-8 luxury-panel p-6 md:p-10" onSubmit={onSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input name="firstName" placeholder="John" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input name="lastName" placeholder="Doe" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <Input name="dateOfBirth" type="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Death</label>
            <Input name="dateOfDeath" type="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <ImageUpload
              value={profileImage}
              onChange={setProfileImage}
              label="Upload Profile Photo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              label="Upload Cover Photo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stream Room Name</label>
            <Input name="streamKey" placeholder="memorial-room-1" />
            <p className="text-xs text-muted-foreground mt-1">Unique room name for LiveKit streaming.</p>
          </div>
          <div className="flex items-center gap-6 pt-8">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="isStreaming" className="h-4 w-4" />
              Enable Streaming
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="isPublished" className="h-4 w-4" defaultChecked />
              Publish Memorial
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Obituary</label>
          <textarea
            name="obituary"
            rows={8}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Write the memorial obituary..."
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting} className="bg-gold-600 hover:bg-gold-700 text-white min-w-[160px]">
          {isSubmitting ? "Creating..." : "Create memorial"}
        </Button>
      </form>
    </div>
  );
}
