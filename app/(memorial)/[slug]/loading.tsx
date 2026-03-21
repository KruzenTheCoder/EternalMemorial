import { DoveLoader } from "@/components/ui/dove-loader";

export default function Loading() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-16 bg-base-200/50">
      <div className="em-surface-elevated w-full max-w-md px-6 py-12 sm:px-10 sm:py-14">
        <DoveLoader label="Preparing memorial details…" />
        <div className="mt-10 space-y-3">
          <div className="skeleton h-3 w-full rounded-full bg-base-300/70" />
          <div className="skeleton h-3 w-5/6 mx-auto rounded-full bg-base-300/60" />
          <div className="skeleton h-3 w-4/6 mx-auto rounded-full bg-base-300/50" />
        </div>
      </div>
    </div>
  );
}
