"use client";

import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { api } from "@workspace/eden";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ArtworkGrid } from "./_components/artwork-grid";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "relevance">(
    "relevance"
  );

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
            Discover Art
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore and discover amazing artworks from talented artists
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks, artists, or tags..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Artworks</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  {Object.entries(filters).map(([key, values]) => (
                    <div key={key}>
                      <h3 className="text-sm font-medium mb-2 capitalize">
                        {key}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <Badge
                            key={value}
                            variant={
                              selectedFilters[key]?.includes(value)
                                ? "default"
                                : "secondary"
                            }
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => toggleFilter(key, value)}
                          >
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    selectedCategory === category.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <Select
              defaultValue="relevance"
              onValueChange={(value: "latest" | "popular" | "relevance") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[180px]">
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

        {posts?.data?.length === 0 && !isPending ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-32 w-32 mb-6 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-full h-full"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 16l5-5c.928-.893 2.072-.893 3 0l5 5" />
                <path d="M14 14l1-1c.928-.893 2.072-.893 3 0l3 3" />
                <circle cx="8" cy="9" r="2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">No artworks found</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Be the first to share your artwork with the community"}
            </p>
            {!searchQuery && (
              <Link href="/upload" className="mt-3">
                <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                  Share Artwork
                </Button>
              </Link>
            )}
          </div>
        ) : isPending ? (
          <ArtworkGridSkeleton />
        ) : (
          <ArtworkGrid posts={posts?.data} />
        )}
      </div>
    </div>
  );
}
