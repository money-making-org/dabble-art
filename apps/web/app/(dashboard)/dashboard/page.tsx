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
import { Plus, Eye, Download, Heart, Search } from "lucide-react";
import Link from "next/link";
import { api } from "@workspace/eden";
import { ArtworkGrid } from "../../_components/artwork-grid";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

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

  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: "relevance",
  });

  const { data: posts, isPending } = useQuery({
    queryKey: ["posts", searchQuery, sortBy],
    queryFn: () =>
      api.public.posts.get({
        query: {
          search: searchQuery,
          sort: sortBy,
          limit: 25,
          page: 1,
        },
      }),
  });

  // edit later
  const stats = {
    views: 69420,
    downloads: 420,
    likes: 69,
  };

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
              {/* Your Artworks */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Artworks</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search artworks..."
                          className="pl-8 w-[200px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select
                        value={sortBy}
                        onValueChange={(
                          value: "relevance" | "latest" | "popular"
                        ) => setSortBy(value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="latest">Latest</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isPending ? (
                    <ArtworkGridSkeleton />
                  ) : (
                    <ArtworkGrid posts={posts?.data} />
                  )}
                </CardContent>
              </Card>
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
                      <p className="text-sm text-muted-foreground">
                        Total Views
                      </p>
                      <p className="text-2xl font-bold">{stats.views}</p>
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
                      <p className="text-2xl font-bold">{stats.downloads}</p>
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
                      <p className="text-sm text-muted-foreground">
                        Total Likes
                      </p>
                      <p className="text-2xl font-bold">{stats.likes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
