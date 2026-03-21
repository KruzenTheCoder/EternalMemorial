import type { ReactNode } from "react";
import { DashboardChrome } from "@/components/dashboard/dashboard-chrome";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardChrome>{children}</DashboardChrome>;
}
