"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { ArtworkGrid } from "../../_components/artwork-grid";
import { Badge } from "@workspace/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Card } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { Instagram, Twitter, Globe, Heart, Eye, Palette, Search } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { useQueryState } from "nuqs";

const mockUser = {
  username: "dawson",
  name: "Dawson",
  avatar: "https://sdmntprwestus.oaiusercontent.com/files/00000000-83dc-5230-9093-27760a869c85/raw?se=2025-03-29T18%3A07%3A41Z&sp=r&sv=2024-08-04&sr=b&scid=549e0daa-5cea-55ca-9e71-6d4f2c7e2025&skoid=72d71449-cf2f-4f10-a498-f160460104ee&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-03-29T15%3A54%3A45Z&ske=2025-03-30T15%3A54%3A45Z&sks=b&skv=2024-08-04&sig=3AQ4PDEUlH%2BQtgK3PC8XmfEY9L4jnhlThEM81ObLkIA%3D",
  bio: "Skid who thinks he's a good coder but is actually a skid.",
  location: "Skidville, USA",
  joinedDate: "Mar 29, 2025",
  stats: {
    artworks: 420,
    followers: 69,
    following: 420,
    likes: 69,
    views: 420,
  },
  social: {
    instagram: "dawson.art",
    twitter: "dawson.art",
    website: "dawson.art",
  },
  tags: ["Skid", "Skid", "Skid", "Skid"],
};

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState("gallery");
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "relevance">("latest");

  const { data: posts, isPending } = useQuery({
    queryKey: ["user-posts", params.username, searchQuery, sortBy],
    queryFn: () =>
      api.public.posts.get({
        query: {
          owner: params.username,
          search: searchQuery,
          sort: sortBy,
          limit: 20,
          page: 1,
        },
      }),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {isPending ? (
          <ProfileSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{mockUser.name}</h1>
                  <p className="text-muted-foreground">@{mockUser.username}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockUser.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockUser.stats.artworks}</div>
                  <div className="text-sm text-muted-foreground">Artworks</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockUser.stats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockUser.stats.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockUser.stats.likes}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockUser.stats.views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="gallery" className="space-y-6">
              <TabsList>
                <TabsTrigger value="gallery">
                  <Palette className="w-4 h-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="about">
                  <Heart className="w-4 h-4 mr-2" />
                  About
                </TabsTrigger>
                <TabsTrigger value="collections">
                  <Eye className="w-4 h-4 mr-2" />
                  Collections
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Gallery</h2>

                </div>
                <ArtworkGrid posts={posts?.data} />
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">About Me</h3>
                      <p className="text-muted-foreground">{mockUser.bio}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Location</h3>
                      <p className="text-muted-foreground">{mockUser.location}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Member Since</h3>
                      <p className="text-muted-foreground">{mockUser.joinedDate}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Social Links</h3>
                      <div className="flex gap-4">
                        <a
                          href={`https://instagram.com/${mockUser.social.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                        <a
                          href={`https://twitter.com/${mockUser.social.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a
                          href={mockUser.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="collections" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-video bg-muted" />
                      <div className="p-4">
                        <h3 className="font-semibold">Collection {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">
                          Like a youtube playlist or something
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
} 