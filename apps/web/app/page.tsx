"use client";

import { useState } from "react";
import { SlidersHorizontal, Search, ArrowRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { api } from "@workspace/eden";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ArtworkGrid } from "./components/artwork-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@workspace/ui/components/skeleton";
import Link from "next/link";
import { unstable_noStore } from "next/cache";

const categories = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Digital Art",
    value: "digital-art",
  },
  {
    name: "Photography",
    value: "photography",
  },
  {
    name: "Illustration",
    value: "illustration",
  },
  {
    name: "Character Design",
    value: "character-design",
  },
  {
    name: "UI/UX",
    value: "UI-UX",
  },
  {
    name: "Logo Design",
    value: "logo",
  },
  {
    name: "Fan Art",
    value: "fan-art",
  },
  {
    name: "3D Art",
    value: "3d",
  },
  {
    name: "Anime",
    value: "anime",
  },
  {
    name: "Realistic",
    value: "realistic",
  },
  {
    name: "Other",
    value: "other",
  },
];

const filters = {
  style: [
    "Realistic",
    "Abstract",
    "Cartoon",
    "Anime",
    "Pixel Art",
    "Minimalist",
  ],
  color: ["Colorful", "Monochrome", "Warm", "Cool", "Pastel", "Neon"],
  medium: ["Digital", "Traditional", "3D", "Photography", "Mixed Media"],
};

function ArtworkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-square rounded-lg" />
      ))}
    </div>
  );
}

export default function DiscoverPage() {
  unstable_noStore();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [sortBy, setSortBy] = useState<
    "latest" | "popular" | "relevance" | "random"
  >("random");

  // Fetch featured posts for the hero background
  const { data: featuredPosts } = useQuery({
    queryKey: ["featured-posts"],
    queryFn: () =>
      api.public.posts.get({
        query: {
          sort: "popular",
          limit: 24,
          page: 1,
        },
      }),
  });

  const { data: posts, isPending } = useQuery({
    queryKey: ["posts", searchQuery, selectedCategory, sortBy],
    queryFn: () =>
      api.public.posts.get({
        query: {
          search: searchQuery,
          categories: selectedCategory ? [selectedCategory] : undefined,
          sort: sortBy,
          limit: 25,
          page: 1,
        },
      }),
  });

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [category]: updated,
      };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-background z-10 -mt-16">
        {/* Background Artwork Grid */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 opacity-40 dark:opacity-20 transition-opacity">
          {featuredPosts?.data?.map((post, i) => {
            const file = post.files[0];
            if (!file) return null;
            
            return (
              <div
                key={post._id}
                className="relative aspect-square bg-muted overflow-hidden group"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/public/posts/${post._id}/files/${file._id}/download`}
                  alt={post.name}
                  className="w-full h-full object-cover brightness-105 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#007FFF]/5 to-transparent dark:from-[#007FFF]/20" />
                <div className="absolute inset-0 backdrop-blur-[0.5px] dark:backdrop-blur-[2px]" />
                {/* Subtle white overlay for light mode only */}
                <div className="absolute inset-0 bg-white/30 dark:hidden" />
              </div>
            );
          })}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="container relative z-20 px-4 text-center">
          {/* Soft radial background gradient for hero content */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vh] z-10" aria-hidden="true">
            <div className="w-full h-full rounded-full bg-gradient-radial from-background/20 via-background/10 to-transparent dark:from-background/80 dark:via-background/60 to-transparent" />
          </div>
          <h1 className="relative z-20 text-5xl md:text-7xl font-bold tracking-tight text-[#007FFF] mb-4 drop-shadow-[0_2px_16px_rgba(0,0,0,0.25)]">
            Discover Amazing Art
          </h1>
          <p className="relative z-20 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.18)]">
            Explore and connect with talented artists from around the world
          </p>
          <div className="max-w-2xl mx-auto relative z-20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground z-10" />
              <Input
                placeholder="Search artworks, artists, or tags..."
                className="pl-10 h-14 text-lg w-full bg-background/90 backdrop-blur-sm border-border/50 hover:border-border focus:border-ring transition-colors shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Categories and Filters Bar */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/50 py-2 z-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2 py-2 overflow-x-scroll overflow-y-auto dabble-scrollbar">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    selectedCategory === category.value ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`whitespace-nowrap flex-shrink-0 rounded-full ${
                    selectedCategory === category.value ? "bg-[#007FFF]" : ""
                  }`}
                >
                  {category.name}
                </Button>
              ))}

              <Select
                defaultValue="relevance"
                onValueChange={(value: "latest" | "popular" | "relevance") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[130px] h-9 rounded-full text-sm">
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
        </div>
      </div>

      <div className="py-12 bg-background">
        <div className="container mx-auto px-4 mb-16 -mt-4">
          {isPending ? (
            <ArtworkGridSkeleton />
          ) : (
            <ArtworkGrid posts={posts?.data} />
          )}
        </div>
      </div>
    </div>
  );
}
