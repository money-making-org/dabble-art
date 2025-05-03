"use client";

import { useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { AdCard } from "@/components/ad-card";
import { DashboardHeader } from "@/app/(dashboard)/dashboard/_components/dashboard-header";
import { StatsOverview } from "@/app/(dashboard)/dashboard/_components/stats-overview";
import { DashboardNavigation } from "@/app/(dashboard)/dashboard/_components/dashboard-navigation";
import { TabContent } from "@/app/(dashboard)/dashboard/_components/tab-content";
import { DashboardSkeleton } from "./_components/dashboard-skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("gallery");
  const { data: session } = authClient.useSession();

  const { data: posts, isPending } = useQuery({
    queryKey: ["dashboard-posts"],
    queryFn: () =>
      api.public.posts.get({
        query: {
          owner: session?.user?.id,
        },
      }),
    enabled: !!session?.user?.id,
  });

  if (isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2 mt-[-20px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Main Content */}
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <DashboardHeader />
            <StatsOverview />
            <TabContent selectedTab={selectedTab} />
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block w-80">
            <div className="sticky top-29.5 space-y-4">
              <DashboardNavigation 
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
              />

              {/* Ad Card */}
              <Card className="p-0 overflow-hidden">
                <AdCard
                  clientId="ca-pub-6714877547689628"
                  slotId="3489516387"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 