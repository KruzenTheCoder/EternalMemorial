"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { DoveLoader } from "@/components/ui/dove-loader";
import { MemorialQRCode } from "@/components/memorial/memorial-qr-code";
import {
  BookHeart,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  ExternalLink,
  Flame,
  ImageIcon,
  ListOrdered,
  MessageCircle,
  Settings,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

/* ─── Types ───────────────────────────────────── */

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

/* ─── Tabs ────────────────────────────────────── */

const TABS = [
  { id: "details", label: "Details", icon: BookHeart },
  { id: "program", label: "Program", icon: ListOrdered },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "tributes", label: "Tributes", icon: MessageCircle },
  { id: "guests", label: "Guests", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Helpers ─────────────────────────────────── */

function toInputDate(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ─── Sub-components ──────────────────────────── */

function SectionHeader({
  icon: Icon,
  title,
  description,
  count,
}: {
  icon: typeof BookHeart;
  title: string;
  description: string;
  count?: number;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-100 border border-gold-200/60 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gold-700" />
        </div>
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
            {title}
            {typeof count === "number" && (
              <span className="text-xs font-sans font-medium bg-gold-100 text-gold-800 px-2 py-0.5 rounded-full border border-gold-200/60">
                {count}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const variants: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${variants[status] || variants.PENDING}`}
    >
      {status}
    </span>
  );
}

/* ─── Main Page ───────────────────────────────── */

export default function EditMemorialPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [memorial, setMemorial] = useState<MemorialResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [isSaving, setIsSaving] = useState(false);
  const [isEventSaving, setIsEventSaving] = useState(false);
  const [isProgramSaving, setIsProgramSaving] = useState(false);
  const [isMediaSaving, setIsMediaSaving] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");

  /* ── Load ── */
  const loadMemorial = useCallback(async () => {
    const response = await fetch(`/api/memorials/${params.id}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Could not load memorial");
    const data = await response.json();
    setMemorial(data);
    setProfileImage(data.profileImage || "");
    setCoverImage(data.coverImage || "");
  }, [params.id]);

  useEffect(() => {
    loadMemorial().catch(() =>
      toast.error("Could not load memorial data.")
    );
  }, [loadMemorial]);

  /* ── CRUD Handlers ── */
  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memorial) return;
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
      toast.success("Memorial saved", {
        description: "All changes have been saved successfully.",
      });
    } catch {
      toast.error("Could not save memorial", {
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function onCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsEventSaving(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      type: String(formData.get("type") || ""),
      startDate: String(formData.get("startDate") || ""),
      location: String(formData.get("location") || ""),
    };

    try {
      const response = await fetch(
        `/api/memorials/${params.id}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Could not create event");
      (event.target as HTMLFormElement).reset();
      await loadMemorial();
      router.refresh();
      toast.success("Event added");
    } catch {
      toast.error("Could not create event");
    } finally {
      setIsEventSaving(false);
    }
  }

  async function onDeleteEvent(eventId: string) {
    try {
      const response = await fetch(
        `/api/memorials/${params.id}/events/${eventId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error();
      await loadMemorial();
      router.refresh();
      toast.success("Event removed");
    } catch {
      toast.error("Could not delete event");
    }
  }

  async function onCreateProgramItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const response = await fetch(
        `/api/memorials/${params.id}/program`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error();
      (event.target as HTMLFormElement).reset();
      await loadMemorial();
      router.refresh();
      toast.success("Program item added");
    } catch {
      toast.error("Could not add program item");
    } finally {
      setIsProgramSaving(false);
    }
  }

  async function onDeleteProgramItem(itemId: string) {
    try {
      const response = await fetch(
        `/api/memorials/${params.id}/program/${itemId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error();
      await loadMemorial();
      router.refresh();
      toast.success("Program item removed");
    } catch {
      toast.error("Could not delete program item");
    }
  }

  async function onAddMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mediaUrl.trim()) return;
    setIsMediaSaving(true);
    try {
      const response = await fetch(
        `/api/memorials/${params.id}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: mediaUrl.trim(),
            type: "PHOTO",
            caption: mediaCaption.trim() || undefined,
          }),
        }
      );
      if (!response.ok) throw new Error();
      setMediaUrl("");
      setMediaCaption("");
      await loadMemorial();
      router.refresh();
      toast.success("Photo added to gallery");
    } catch {
      toast.error("Could not add photo");
    } finally {
      setIsMediaSaving(false);
    }
  }

  async function onDeleteMedia(mediaId: string) {
    try {
      const response = await fetch(
        `/api/memorials/${params.id}/media/${mediaId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error();
      await loadMemorial();
      router.refresh();
      toast.success("Photo removed");
    } catch {
      toast.error("Could not remove photo");
    }
  }

  async function onTributeStatus(
    tributeId: string,
    status: "APPROVED" | "REJECTED"
  ) {
    try {
      const response = await fetch(
        `/api/memorials/${params.id}/tributes/${tributeId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error();
      await loadMemorial();
      router.refresh();
      toast.success(
        status === "APPROVED" ? "Tribute approved" : "Tribute rejected"
      );
    } catch {
      toast.error("Could not update tribute");
    }
  }

  /* ── Loading State ── */
  if (!memorial) {
    return (
      <div className="container mx-auto py-10 max-w-5xl">
        <div className="luxury-panel px-8 py-14">
          <DoveLoader label="Loading memorial..." />
        </div>
      </div>
    );
  }

  const pendingTributes = memorial.tributes.filter(
    (t) => t.status === "PENDING"
  ).length;

  /* ── Render ── */
  return (
    <div className="container mx-auto py-6 sm:py-10 max-w-5xl px-4">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700/80 mb-1 font-sans">
            Memorial Editor
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground truncate">
            {memorial.firstName} {memorial.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-muted-foreground font-mono">
              /{memorial.slug}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                memorial.isPublished
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-100 text-neutral-600 border border-neutral-200"
              }`}
            >
              {memorial.isPublished ? "Published" : "Draft"}
            </span>
            {memorial.isStreaming && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 animate-pulse">
                Live
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/${memorial.slug}`} target="_blank">
            <Button
              variant="outline"
              className="gap-2 border-gold-200 hover:bg-gold-50"
            >
              <ExternalLink className="w-4 h-4" /> View Page
            </Button>
          </Link>
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={() =>
              window.open(
                `/dashboard/memorials/${memorial.id}/stream`,
                "_blank"
              )
            }
          >
            <Clapperboard className="w-4 h-4" /> Stream
          </Button>
        </div>
      </div>

      {/* ─── Tab Navigation ─── */}
      <div className="border-b border-gold-200/50 mb-6 overflow-x-auto no-scrollbar">
        <nav className="flex gap-0.5 min-w-max" aria-label="Editor sections">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "text-gold-900"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === "tributes" && pendingTributes > 0 && (
                <span className="absolute -top-0.5 right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingTributes}
                </span>
              )}
              {activeTab === id && (
                <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gold-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="min-h-[50vh]">
        {/* DETAILS TAB */}
        {activeTab === "details" && (
          <div className="luxury-panel p-6 md:p-8">
            <SectionHeader
              icon={BookHeart}
              title="Memorial Details"
              description="Edit the core information shown on the public memorial page."
            />
            <form className="space-y-6" onSubmit={onSave}>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    defaultValue={memorial.firstName}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    defaultValue={memorial.lastName}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    defaultValue={toInputDate(memorial.dateOfBirth)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Death
                  </label>
                  <Input
                    name="dateOfDeath"
                    type="date"
                    defaultValue={toInputDate(memorial.dateOfDeath)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profile Image
                  </label>
                  <ImageUpload
                    value={profileImage}
                    onChange={setProfileImage}
                    label="Upload Profile Photo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Image
                  </label>
                  <ImageUpload
                    value={coverImage}
                    onChange={setCoverImage}
                    label="Upload Cover Photo"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Obituary
                </label>
                <textarea
                  name="obituary"
                  rows={10}
                  defaultValue={memorial.obituary || ""}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-300 transition-all"
                  placeholder="Write the obituary with love and detail..."
                />
              </div>
              {/* Hidden fields for settings preserved across tabs */}
              <input
                type="hidden"
                name="streamKey"
                value={memorial.streamKey || ""}
              />
              <input
                type="hidden"
                name="isStreaming"
                value={memorial.isStreaming ? "on" : ""}
              />
              <input
                type="hidden"
                name="isPublished"
                value={memorial.isPublished ? "on" : ""}
              />
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold-600 hover:bg-gold-700 text-white min-w-[140px]"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* PROGRAM TAB */}
        {activeTab === "program" && (
          <div className="space-y-6">
            <div className="luxury-panel p-6 md:p-8">
              <SectionHeader
                icon={ListOrdered}
                title="Service Program"
                description="Build the order of service — readings, songs, eulogies, and prayers."
                count={memorial.program.length}
              />
              <form
                className="grid sm:grid-cols-2 md:grid-cols-12 gap-4 items-end bg-gold-50/40 p-5 rounded-xl border border-gold-200/40"
                onSubmit={onCreateProgramItem}
              >
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Time
                  </label>
                  <Input name="time" placeholder="10:00 AM" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Title
                  </label>
                  <Input
                    name="title"
                    placeholder="Opening Prayer"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Type
                  </label>
                  <select
                    name="type"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                  >
                    <option value="READING">Reading</option>
                    <option value="SONG">Song / Hymn</option>
                    <option value="EULOGY">Eulogy</option>
                    <option value="PRAYER">Prayer</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Speaker
                  </label>
                  <Input name="speakerName" placeholder="Rev. Smith" />
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={isProgramSaving}
                    className="w-full bg-gold-600 hover:bg-gold-700 text-white"
                  >
                    {isProgramSaving ? "Adding…" : "Add"}
                  </Button>
                </div>
                <div className="md:col-span-12">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Content (lyrics, scripture, notes)
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                    placeholder="Psalm 23..."
                  />
                </div>
              </form>
            </div>

            <div className="space-y-2">
              {memorial.program.length === 0 ? (
                <div className="luxury-panel p-10 text-center">
                  <ListOrdered className="w-10 h-10 text-gold-300 mx-auto mb-3" />
                  <p className="text-muted-foreground font-serif italic">
                    No program items yet. Add your first item above.
                  </p>
                </div>
              ) : (
                [...memorial.program]
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 luxury-card hover:shadow-material-lg transition-shadow group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold-50 border border-gold-200/60 flex items-center justify-center shrink-0 text-sm font-mono text-gold-700">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-gold-100 text-gold-800 px-2 py-0.5 rounded-md">
                            {item.type}
                          </span>
                          <h4 className="font-semibold text-foreground">
                            {item.title}
                          </h4>
                          {item.time && (
                            <span className="text-xs font-mono text-muted-foreground">
                              {item.time}
                            </span>
                          )}
                        </div>
                        {item.speakerName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            By {item.speakerName}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm mt-2 text-foreground/80 whitespace-pre-wrap border-l-2 border-gold-200 pl-3 italic">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProgramItem(item.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="luxury-panel p-6 md:p-8">
              <SectionHeader
                icon={ImageIcon}
                title="Memory Gallery"
                description="Add photos by URL to the memorial slideshow."
                count={memorial.media.length}
              />
              <form
                className="flex flex-col sm:flex-row gap-3 items-end bg-gold-50/40 p-5 rounded-xl border border-gold-200/40"
                onSubmit={onAddMedia}
              >
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Image URL
                  </label>
                  <Input
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="w-full sm:w-40">
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Caption
                  </label>
                  <Input
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    placeholder="Summer 1998"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isMediaSaving}
                  className="bg-gold-600 hover:bg-gold-700 text-white w-full sm:w-auto"
                >
                  {isMediaSaving ? "Adding…" : "Add Photo"}
                </Button>
              </form>
            </div>

            {memorial.media.length === 0 ? (
              <div className="luxury-panel p-10 text-center">
                <ImageIcon className="w-10 h-10 text-gold-300 mx-auto mb-3" />
                <p className="text-muted-foreground font-serif italic">
                  No gallery images yet. Add your first photo above.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {memorial.media.map((m) => (
                  <div
                    key={m.id}
                    className="luxury-card overflow-hidden group relative"
                  >
                    <div className="aspect-[4/3] bg-neutral-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={m.caption || "Memorial photo"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/80 hover:bg-red-700 hover:text-white"
                          onClick={() => onDeleteMedia(m.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                    {m.caption && (
                      <div className="p-3 text-sm text-muted-foreground truncate">
                        {m.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="luxury-panel p-6 md:p-8">
              <SectionHeader
                icon={CalendarDays}
                title="Service Events"
                description="Add funeral services, viewings, and memorial gatherings."
                count={memorial.events.length}
              />
              <form
                className="grid sm:grid-cols-2 gap-4 items-end bg-gold-50/40 p-5 rounded-xl border border-gold-200/40"
                onSubmit={onCreateEvent}
              >
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Title
                  </label>
                  <Input
                    name="title"
                    placeholder="Funeral Service"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Type
                  </label>
                  <Input name="type" placeholder="Funeral" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Date & Time
                  </label>
                  <Input name="startDate" type="datetime-local" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                    Location
                  </label>
                  <Input name="location" placeholder="Church Hall" />
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={isEventSaving}
                    className="bg-gold-600 hover:bg-gold-700 text-white"
                  >
                    {isEventSaving ? "Adding…" : "Add Event"}
                  </Button>
                </div>
              </form>
            </div>

            {memorial.events.length === 0 ? (
              <div className="luxury-panel p-10 text-center">
                <CalendarDays className="w-10 h-10 text-gold-300 mx-auto mb-3" />
                <p className="text-muted-foreground font-serif italic">
                  No events scheduled yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {memorial.events.map((item) => (
                  <div
                    key={item.id}
                    className="luxury-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200/60 flex flex-col items-center justify-center shrink-0 text-xs">
                        <span className="font-bold text-gold-800">
                          {new Date(item.startDate).toLocaleDateString(
                            undefined,
                            { day: "numeric" }
                          )}
                        </span>
                        <span className="text-[9px] uppercase text-muted-foreground">
                          {new Date(item.startDate).toLocaleDateString(
                            undefined,
                            { month: "short" }
                          )}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.type} ·{" "}
                          {new Date(item.startDate).toLocaleString(
                            undefined,
                            { timeStyle: "short" }
                          )}
                          {item.location ? ` · ${item.location}` : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEvent(item.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-end sm:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRIBUTES TAB */}
        {activeTab === "tributes" && (
          <div className="space-y-4">
            <SectionHeader
              icon={MessageCircle}
              title="Messages & Moderation"
              description="Approve condolence messages before they appear on the public page."
              count={memorial.tributes.length}
            />
            {memorial.tributes.length === 0 ? (
              <div className="luxury-panel p-10 text-center">
                <MessageCircle className="w-10 h-10 text-gold-300 mx-auto mb-3" />
                <p className="text-muted-foreground font-serif italic">
                  No messages yet. They will appear here when visitors
                  leave tributes.
                </p>
              </div>
            ) : (
              memorial.tributes.map((t) => (
                <div
                  key={t.id}
                  className="luxury-card p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-sm font-display text-gold-800">
                        {t.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {t.authorName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {timeAgo(t.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={t.status} />
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed pl-10">
                    {t.content}
                  </p>
                  <div className="flex gap-2 pl-10 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={() =>
                        onTributeStatus(t.id, "APPROVED")
                      }
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() =>
                        onTributeStatus(t.id, "REJECTED")
                      }
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* GUESTS TAB */}
        {activeTab === "guests" && (
          <div className="space-y-4">
            <SectionHeader
              icon={Users}
              title="Guest Activity"
              description="Recent guest book entries and virtual candles."
              count={memorial.checkins.length}
            />
            {memorial.checkins.length === 0 ? (
              <div className="luxury-panel p-10 text-center">
                <Users className="w-10 h-10 text-gold-300 mx-auto mb-3" />
                <p className="text-muted-foreground font-serif italic">
                  No guest activity yet.
                </p>
              </div>
            ) : (
              <div className="luxury-panel divide-y divide-border/40">
                {memorial.checkins.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gold-50 border border-gold-200/50 flex items-center justify-center shrink-0">
                        {c.entryType === "CANDLE" ? (
                          <Flame className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Users className="w-4 h-4 text-gold-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {c.name}
                        </p>
                        {c.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {c.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                        {c.entryType === "CANDLE"
                          ? "Candle"
                          : "Guest book"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="luxury-panel p-6 md:p-8">
            <SectionHeader
              icon={Settings}
              title="Memorial Settings"
              description="Configure publishing, streaming, and advanced options."
            />
            <form className="space-y-6" onSubmit={onSave}>
              {/* Forward all detail fields as hidden */}
              <input
                type="hidden"
                name="firstName"
                value={memorial.firstName}
              />
              <input
                type="hidden"
                name="lastName"
                value={memorial.lastName}
              />
              <input
                type="hidden"
                name="dateOfBirth"
                value={toInputDate(memorial.dateOfBirth)}
              />
              <input
                type="hidden"
                name="dateOfDeath"
                value={toInputDate(memorial.dateOfDeath)}
              />
              <input
                type="hidden"
                name="obituary"
                value={memorial.obituary || ""}
              />

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl border border-gold-200/40 bg-gold-50/30">
                  <div>
                    <p className="font-medium text-sm">
                      Publish Memorial
                    </p>
                    <p className="text-xs text-muted-foreground">
                      When published, the memorial page is accessible to
                      anyone with the link.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublished"
                      className="sr-only peer"
                      defaultChecked={memorial.isPublished}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-400/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500" />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-gold-200/40 bg-gold-50/30">
                  <div>
                    <p className="font-medium text-sm">
                      Enable Live Streaming
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Enables the LiveKit live stream section on the
                      memorial page.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isStreaming"
                      className="sr-only peer"
                      defaultChecked={memorial.isStreaming}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold-400/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500" />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stream Room Name
                  </label>
                  <Input
                    name="streamKey"
                    defaultValue={memorial.streamKey || ""}
                    placeholder="memorial-room-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Unique LiveKit room name for this memorial&apos;s
                    live stream.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gold-200/40 bg-gold-50/30">
                  <p className="font-medium text-sm mb-1">
                    Memorial URL
                  </p>
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : ""}
                    /{memorial.slug}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="pt-6 border-t border-gold-200/40">
                <MemorialQRCode
                  slug={memorial.slug}
                  name={`${memorial.firstName} ${memorial.lastName}`}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold-600 hover:bg-gold-700 text-white min-w-[140px]"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
