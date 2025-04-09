"use client";

import { useState, useCallback } from "react";
import { Button } from "@workspace/ui/components/button";
import { ArtworkGrid } from "../../components/artwork-grid";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Card, CardContent, CardTitle, CardHeader } from "@workspace/ui/components/card";
import { Instagram, Twitter, Globe, Heart, Eye, Palette, Search, MessageCircle, User, Folder } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { useQueryState } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { authClient } from "@/lib/auth-client";
import { unstable_noStore } from "next/cache";

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  unstable_noStore();
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: "relevance",
  });
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [isDeletePending, setIsDeletePending] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user", params.username],
    queryFn: () => api.users[params.username].get(),
  });

  const { data: posts, isPending } = useQuery({
    queryKey: ["posts", "profile", params.username, searchQuery, sortBy],
    queryFn: () =>
      api.public.posts.get({
        query: {
          search: searchQuery,
          sort: sortBy,
          limit: 25,
          page: 1,
          owner: userData?.data?._id,
        },
      }),
    enabled: !!userData?.data?._id,
  });

  const handleDelete = useCallback(
    async (postId: string) => {
      try {
        setIsDeletePending(true);
        await api.public.posts({ id: postId }).delete();
        await queryClient.invalidateQueries({
          queryKey: ["posts", "profile", params.username],
        });
      } catch (err) {
        console.error("Failed to delete post:", err);
        throw err;
      } finally {
        setIsDeletePending(false);
      }
    },
    [queryClient, params.username]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Image */}
      <div className="relative h-48 md:h-64 w-full">
        <img
          src={"https://pingcraft.io/_app/immutable/assets/banner.AzxsXaih.png"}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-8 relative z-10">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={"https://pingcraft.io/favicon.png"}
                  alt={params.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                />
                <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground">
                  <Palette className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{params.username}</h1>
                  <p className="text-muted-foreground">@{params.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">tags</Badge>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                About
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Collections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Gallery</h2>

              </div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User's Artworks</CardTitle>
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
                    <ArtworkGrid
                      posts={posts?.data}
                      currentUserId={session?.user?.id}
                      onDelete={handleDelete}
                      isDeletePending={isDeletePending}
                    />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">About Me</h3>
                    <p className="text-muted-foreground leading-relaxed">User bio.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Location</h3>
                    <p className="text-muted-foreground">United States</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Member Since</h3>
                    <p className="text-muted-foreground">Mar 29, 2025</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Social Links
                    </h3>
                    <div className="flex gap-4">
                      <a
                        href={`https://instagram.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href={`https://twitter.com/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href={'https://pingcraft.io'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="collections">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden group hover:shadow-lg transition-all">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <h3 className="font-semibold">Collection {i + 1}</h3>
                        <p className="text-sm text-white/80">
                          Youtube playlist type feature to organize your artworks.
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
