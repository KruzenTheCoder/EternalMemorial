"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { DoveLoader } from "@/components/ui/dove-loader";

type EventItem = {
  id: string;
  title: string;
  type: string;
  location: string | null;
  startDate: string;
};

type ProgramItem = {
  id: string;
  title: string;
  type: string;
  time: string | null;
  description: string | null;
  order: number;
  speakerName: string | null;
};

type MediaItem = {
  id: string;
  type: string;
  url: string;
  caption: string | null;
};

type TributeItem = {
  id: string;
  authorName: string;
  content: string;
  status: string;
  createdAt: string;
};

type CheckInItem = {
  id: string;
  name: string;
  email: string | null;
  entryType: string;
  createdAt: string;
};

type MemorialResponse = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  obituary: string | null;
  profileImage: string | null;
  coverImage: string | null;
  streamKey: string | null;
  isStreaming: boolean;
  isPublished: boolean;
  events: EventItem[];
  program: ProgramItem[];
  media: MediaItem[];
  tributes: TributeItem[];
  checkins: CheckInItem[];
};

function toInputDate(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

export default function EditMemorialPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [memorial, setMemorial] = useState<MemorialResponse | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEventSaving, setIsEventSaving] = useState(false);
  const [isProgramSaving, setIsProgramSaving] = useState(false);
  const [isMediaSaving, setIsMediaSaving] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");

  const loadMemorial = useCallback(async () => {
    const response = await fetch(`/api/memorials/${params.id}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load memorial");
    const data = await response.json();
    setMemorial(data);
    setProfileImage(data.profileImage || "");
    setCoverImage(data.coverImage || "");
  }, [params.id]);

  useEffect(() => {
    loadMemorial().catch(() => setError("Could not load memorial"));
  }, [loadMemorial]);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memorial) return;
    setError("");
    setIsSaving(true);
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
      const response = await fetch(`/api/memorials/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Could not update memorial");
      await loadMemorial();
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update memorial");
    } finally {
      setIsSaving(false);
    }
  }

  async function onCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsEventSaving(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      type: String(formData.get("type") || ""),
      startDate: String(formData.get("startDate") || ""),
      location: String(formData.get("location") || ""),
    };

    try {
      const response = await fetch(`/api/memorials/${params.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Could not create event");
      (event.target as HTMLFormElement).reset();
      await loadMemorial();
      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not create event");
    } finally {
      setIsEventSaving(false);
    }
  }

  async function onDeleteEvent(eventId: string) {
    setError("");
    try {
      const response = await fetch(`/api/memorials/${params.id}/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete event");
      await loadMemorial();
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete event");
    }
  }

  async function onCreateProgramItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsProgramSaving(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      type: String(formData.get("type") || "OTHER"),
      time: String(formData.get("time") || ""),
      description: String(formData.get("description") || ""),
      speakerName: String(formData.get("speakerName") || ""),
      order: memorial?.program ? memorial.program.length + 1 : 1,
    };

    try {
      const response = await fetch(`/api/memorials/${params.id}/program`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Could not add program item");
      (event.target as HTMLFormElement).reset();
      await loadMemorial();
      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not add program item");
    } finally {
      setIsProgramSaving(false);
    }
  }

  async function onAddMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mediaUrl.trim()) return;
    setError("");
    setIsMediaSaving(true);
    try {
      const response = await fetch(`/api/memorials/${params.id}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: mediaUrl.trim(),
          type: "PHOTO",
          caption: mediaCaption.trim() || undefined,
        }),
      });
      if (!response.ok) throw new Error("Could not add photo");
      setMediaUrl("");
      setMediaCaption("");
      await loadMemorial();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add photo");
    } finally {
      setIsMediaSaving(false);
    }
  }

  async function onDeleteMedia(mediaId: string) {
    setError("");
    try {
      const response = await fetch(`/api/memorials/${params.id}/media/${mediaId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not remove photo");
      await loadMemorial();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove photo");
    }
  }

  async function onTributeStatus(tributeId: string, status: "APPROVED" | "REJECTED") {
    setError("");
    try {
      const response = await fetch(`/api/memorials/${params.id}/tributes/${tributeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Could not update message");
      await loadMemorial();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update message");
    }
  }

  async function onDeleteProgramItem(itemId: string) {
    setError("");
    try {
      const response = await fetch(`/api/memorials/${params.id}/program/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not delete program item");
      await loadMemorial();
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete program item");
    }
  }

  if (!memorial) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="luxury-panel px-8 py-14">
          <DoveLoader label="Loading memorial..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-10 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Edit memorial · {memorial.firstName} {memorial.lastName}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-mono">/{memorial.slug}</p>
        </div>
        <Link href={`/${memorial.slug}`} target="_blank">
          <Button className="bg-gold-600 hover:bg-gold-700 text-white w-full sm:w-auto">Open public page</Button>
        </Link>
      </div>

      <form className="space-y-6 luxury-panel p-6 md:p-8" onSubmit={onSave}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <Input name="firstName" defaultValue={memorial.firstName} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <Input name="lastName" defaultValue={memorial.lastName} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <Input name="dateOfBirth" type="date" defaultValue={toInputDate(memorial.dateOfBirth)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Death</label>
            <Input name="dateOfDeath" type="date" defaultValue={toInputDate(memorial.dateOfDeath)} required />
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
            <Input name="streamKey" defaultValue={memorial.streamKey || ""} placeholder="memorial-room-1" />
            <p className="text-xs text-muted-foreground mt-1">Unique room name for LiveKit streaming.</p>
          </div>
          <div className="md:col-span-2">
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full sm:w-auto"
              onClick={() => window.open(`/dashboard/memorials/${memorial.id}/stream`, '_blank')}
            >
              🎥 Open Admin Stream Studio
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-8">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="isStreaming" className="h-4 w-4" defaultChecked={memorial.isStreaming} />
              Streaming Enabled
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="isPublished" className="h-4 w-4" defaultChecked={memorial.isPublished} />
              Published
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Obituary</label>
          <textarea
            name="obituary"
            rows={8}
            defaultValue={memorial.obituary || ""}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Memorial"}
        </Button>
      </form>

      {/* Service Program Section */}
      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-semibold">Service Program / Itinerary</h2>
        <p className="text-sm text-muted-foreground mb-4">Create a digital service booklet for the memorial.</p>
        
        <form className="grid md:grid-cols-12 gap-4 items-end bg-muted/20 p-4 rounded-lg border" onSubmit={onCreateProgramItem}>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Time</label>
            <Input name="time" placeholder="10:00 AM" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1">Title</label>
            <Input name="title" placeholder="Opening Prayer" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Type</label>
            <select name="type" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="READING">Reading</option>
              <option value="SONG">Song/Hymn</option>
              <option value="EULOGY">Eulogy</option>
              <option value="PRAYER">Prayer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1">Speaker / Details</label>
            <Input name="speakerName" placeholder="Rev. Smith" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isProgramSaving} className="w-full">
              {isProgramSaving ? "Adding..." : "Add Item"}
            </Button>
          </div>
          <div className="md:col-span-12">
            <label className="block text-xs font-medium mb-1">Content (Lyrics, Scripture, Notes)</label>
            <textarea
              name="description"
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Psalm 23..."
            />
          </div>
        </form>

        <div className="space-y-2 mt-4">
          {(!memorial.program || memorial.program.length === 0) ? (
            <p className="text-sm text-muted-foreground italic text-center py-4">No program items yet.</p>
          ) : (
            memorial.program
              .sort((a, b) => a.order - b.order)
              .map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white/50 hover:bg-white transition-colors">
                <div className="w-20 text-sm font-mono text-muted-foreground pt-1">{item.time}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-gold-100 text-gold-800 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                    <h4 className="font-semibold">{item.title}</h4>
                  </div>
                  {item.speakerName && <p className="text-sm text-muted-foreground mt-1">By {item.speakerName}</p>}
                  {item.description && (
                    <p className="text-sm mt-2 text-foreground/80 whitespace-pre-wrap border-l-2 border-gold-200 pl-3 italic">
                      {item.description}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDeleteProgramItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-display font-semibold">Memory gallery</h2>
        <p className="text-sm text-muted-foreground">
          Add photos by URL (for example from your Supabase bucket) or use uploads on the fields above for profile and cover.
        </p>
        <form className="grid md:grid-cols-12 gap-4 items-end bg-muted/20 p-4 rounded-lg border" onSubmit={onAddMedia}>
          <div className="md:col-span-7">
            <label className="block text-xs font-medium mb-1">Image URL</label>
            <Input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://…"
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium mb-1">Caption (optional)</label>
            <Input value={mediaCaption} onChange={(e) => setMediaCaption(e.target.value)} placeholder="Summer 1998" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isMediaSaving} className="w-full bg-gold-600 hover:bg-gold-700">
              {isMediaSaving ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
        <div className="grid sm:grid-cols-2 gap-4">
          {(memorial.media ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">No gallery images yet.</p>
          ) : (
            (memorial.media ?? []).map((m) => (
              <div key={m.id} className="flex gap-3 p-3 border rounded-lg bg-white/60 items-center">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{m.caption || "Photo"}</p>
                  <p className="text-[10px] font-mono truncate opacity-70">{m.url}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-red-600 shrink-0" onClick={() => onDeleteMedia(m.id)}>
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-display font-semibold">Messages & moderation</h2>
        <p className="text-sm text-muted-foreground">Approve condolence messages before they appear on the public page.</p>
        <div className="space-y-3">
          {(memorial.tributes ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            (memorial.tributes ?? []).map((t) => (
              <div key={t.id} className="border rounded-lg p-4 bg-white/70 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{t.authorName}</p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      t.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap text-foreground/90">{t.content}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => onTributeStatus(t.id, "APPROVED")}>
                    Approve
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => onTributeStatus(t.id, "REJECTED")}>
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-display font-semibold">Guest activity</h2>
        <p className="text-sm text-muted-foreground">Recent guest book entries and virtual candles.</p>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {(memorial.checkins ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            (memorial.checkins ?? []).map((c) => (
              <div key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm border-b border-border/40 pb-2">
                <div>
                  <span className="font-medium">{c.name}</span>
                  {c.email ? <span className="text-muted-foreground"> · {c.email}</span> : null}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="uppercase tracking-wide">
                    {c.entryType === "CANDLE" ? "Candle" : "Guest book"}
                  </span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t">
        <h2 className="text-2xl font-semibold">Service Events (Logistics)</h2>
        <form className="grid md:grid-cols-4 gap-4 items-end" onSubmit={onCreateEvent}>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input name="title" placeholder="Funeral Service" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Input name="type" placeholder="Funeral" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <Input name="startDate" type="datetime-local" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input name="location" placeholder="Church Hall" />
          </div>
          <div className="md:col-span-4">
            <Button type="submit" disabled={isEventSaving}>
              {isEventSaving ? "Adding..." : "Add Event"}
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          {memorial.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          ) : (
            memorial.events.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 flex justify-between gap-4 items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} · {new Date(item.startDate).toLocaleString()} {item.location ? `· ${item.location}` : ""}
                  </p>
                </div>
                <Button variant="outline" onClick={() => onDeleteEvent(item.id)}>Delete</Button>
              </div>
            ))
          )}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
