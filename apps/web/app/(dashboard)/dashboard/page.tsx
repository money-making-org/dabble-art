"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { api } from "@workspace/eden";
import { useQueryState } from "nuqs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";
import { unstable_noStore } from "next/cache";
import { authClient } from "@/lib/auth-client";
import type { Post } from "../../components/artwork-grid";
import { useState, useCallback } from "react";
import { EditArtworkModal } from "./_components/edit-artwork-modal";
import DashboardGallery from "./_components/dashboard-gallery";
import { DashboardNav } from "./_components/dashboard-nav";
import { AnalyticsTab } from "./_components/analytics-tab";
import { useSearchParams } from "next/navigation";

function ArtworkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-square rounded-lg" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  unstable_noStore();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "gallery";

  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: "relevance",
  });

  const { data: posts, isPending } = useQuery({
    queryKey: ["posts", "dashboard", searchQuery, sortBy, session?.user?.id],
    queryFn: () =>
      api.public.posts.get({
        query: {
          search: searchQuery,
          sort: sortBy as "relevance" | "latest" | "popular" | undefined,
          limit: 25,
          page: 1,
          owner: session?.user?.id,
        },
      }),
    enabled: !!session?.user?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats", "dashboard", session?.user?.id],
    queryFn: async () => {
      const userPosts = await api.public.posts.get({
        query: {
          owner: session?.user?.id,
        },
      });

      if (!userPosts.data) return { views: 0, likes: 0, downloads: 0 };

      const totalViews = userPosts.data.reduce(
        (acc: number, post: any) => acc + (post.analytics?.views || 0),
        0
      );
      const totalDownloads = userPosts.data.reduce(
        (acc: number, post: any) => acc + (post.analytics?.downloads || 0),
        0
      );
      const totalLikes = userPosts.data.reduce(
        (acc: number, post: any) => acc + (post.likeCount || 0),
        0
      );

      return {
        views: totalViews,
        likes: totalLikes,
        downloads: totalDownloads,
      };
    },
    enabled: !!session?.user?.id,
  });

  const handleDelete = useCallback(
    async (postId: string) => {
      try {
        setIsDeletePending(true);
        await api.public.posts[postId].delete();
        // Invalidate the posts query to refresh the data
        await queryClient.invalidateQueries({
          queryKey: ["posts", "dashboard"],
        });
        // Also invalidate stats since they depend on posts
        await queryClient.invalidateQueries({
          queryKey: ["stats", "dashboard"],
        });
      } catch (err) {
        console.error("Failed to delete post:", err);
        throw err;
      } finally {
        setIsDeletePending(false);
      }
    },
    [queryClient]
  );

  const handleEdit = useCallback((artwork: Post) => {
    setSelectedArtwork(artwork);
    setIsEditModalOpen(true);
  }, []);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-[160px]" />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <Card>
                <CardContent>
                  <ArtworkGridSkeleton />
                </CardContent>
              </Card>
            </div>

            <div className="w-80">
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case "analytics":
        return <AnalyticsTab stats={stats || { views: 0, downloads: 0, likes: 0 }} />;
      case "gallery":
      default:
        return (
          <DashboardGallery 
            user={session?.user} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeletePending={isDeletePending}
          />
        );
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New Artwork
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {renderContent()}
            </div>

            {/* Right Navigation */}
            <div className="w-80 space-y-6">
              <DashboardNav />

              {/* Side Ad Placement */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">Advertisement</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {selectedArtwork && (
        <EditArtworkModal
          artwork={selectedArtwork}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedArtwork(null);
          }}
        />
      )}
    </Suspense>
  );
}
