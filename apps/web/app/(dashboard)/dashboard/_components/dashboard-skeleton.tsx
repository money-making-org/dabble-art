import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2 mt-[-20px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Main Content */}
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            {/* Header Skeleton */}
            <Card className="p-8 flex items-center justify-between">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-10 w-32" />
            </Card>

            {/* Stats Overview Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 flex flex-col items-center">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-9 w-16" />
                </Card>
              ))}
            </div>

            {/* Tab Content Skeleton */}
            <Card className="p-8">
              <Skeleton className="h-7 w-32 mb-4" />
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg border overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-3/4 mt-4" />
                    </div>
                    <Skeleton className="w-full aspect-[4/3]" />
                    <div className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="hidden md:block w-80">
            <div className="sticky top-29.5 space-y-4">
              {/* Navigation Skeleton */}
              <Card className="bg-card p-4 rounded-lg border">
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-md" />
                  ))}
                </div>
              </Card>

              {/* Ad Card Skeleton */}
              <Card className="p-0 overflow-hidden">
                <Skeleton className="h-32 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 