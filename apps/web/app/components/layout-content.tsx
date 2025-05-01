"use client";

import { useContext } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { MainNavigation } from "./main-navigation";
import { MainSidebar, SidebarContext } from "./main-sidebar";
import { Footer } from "./footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useContext(SidebarContext);

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavigation />
      <div className="flex flex-1 relative">
        <MainSidebar />
        <div className={cn(
          "flex-1 transition-all duration-300",
          isExpanded ? "md:ml-64" : "md:ml-16"
        )}>
          <main className="pt-16">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 