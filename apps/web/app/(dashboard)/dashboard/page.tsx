"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Plus, Eye, Download, Heart, Search, Loader2 } from "lucide-react";
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
          sort: sortBy,
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
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-[200px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ArtworkGridSkeleton />
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="w-80 space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
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
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <DashboardGallery 
                user={session?.user} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeletePending={isDeletePending}
              />
            </div>

            {/* Stats Sidebar */}
            <div className="w-80 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Eye className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{stats?.views ?? 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <Download className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                      <p className="text-2xl font-bold">{stats?.downloads ?? 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-500/10">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Likes</p>
                      <p className="text-2xl font-bold">{stats?.likes ?? 0}</p>
                    </div>
                  </div>
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
