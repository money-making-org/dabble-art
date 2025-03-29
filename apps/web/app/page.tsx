"use client";

import { useState } from "react";
import { SlidersHorizontal, Search, ArrowRight } from "lucide-react";
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
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="container relative z-20 px-4 text-center">
          
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-4">
              Discover Amazing Art
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore and connect with talented artists from around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search artworks, artists, or tags..."
                  className="pl-10 h-12 text-lg w-full bg-background/50 backdrop-blur-sm border-border/50 hover:border-border focus:border-ring transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/upload" className="sm:flex-shrink-0 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 w-full sm:w-auto h-12 text-lg hover:opacity-90 transition-opacity"
                >
                  Share Your Art <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
        </div>
      </div>

      {/* Categories and Filters Bar */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 py-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`whitespace-nowrap flex-shrink-0 rounded-full ${
                    selectedCategory === category.value
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white"
                      : ""
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
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
                      <div key={key} className="mb-6">
                        <h3 className="text-sm font-medium mb-3 capitalize">
                          {key}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value) => (
                            <Badge
                              key={value}
                              variant={selectedFilters[key]?.includes(value) ? "default" : "secondary"}
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground rounded-full px-4"
                              onClick={() => toggleFilter(key, value)}
                            >
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Select
                defaultValue="relevance"
                onValueChange={(value: "latest" | "popular" | "relevance") => setSortBy(value)}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
