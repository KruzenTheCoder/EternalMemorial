import { DoveLoader } from "@/components/ui/dove-loader";

export default function DashboardLoading() {
  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-4 py-16">
      <div className="em-surface w-full max-w-lg px-8 py-12">
        <DoveLoader label="Loading your memorials…" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="skeleton h-36 rounded-3xl bg-base-300/50" />
          <div className="skeleton h-36 rounded-3xl bg-base-300/50" />
        </div>
      </div>
    </div>
  );
}
