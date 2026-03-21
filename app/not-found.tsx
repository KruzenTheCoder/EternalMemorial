import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center luxury-card p-8">
        <h1 className="text-3xl font-display font-bold mb-3">Memorial not found</h1>
        <p className="text-muted-foreground mb-6">
          This memorial link may be unpublished, moved, or not available in this environment yet.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
          <Link href="/auth/login">
            <Button className="bg-gold-600 hover:bg-gold-700 text-white">Open Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

