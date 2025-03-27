import { AppSidebar } from "@workspace/ui/components/app-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { SidebarInset } from "@workspace/ui/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}