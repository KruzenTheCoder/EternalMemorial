import { DoveLoader } from "@/components/ui/dove-loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="luxury-panel w-full max-w-xl px-8 py-14">
        <DoveLoader label="Preparing memorial details..." />
      </div>
    </div>
  );
}

