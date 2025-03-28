"use client";

import { Search } from "lucide-react";

import { api } from "@workspace/eden";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { ArtworkGrid } from "../_components/artwork-grid";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useState } from "react";

const categories = [
  "All",
  "Digital Art",
  "Illustration",
  "Photography",
  "3D Art",
  "Concept Art",
  "Character Design",
  "Environment Art",
  "Animation",
  "UI/UX Design",
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
  time: ["Latest", "Most Popular", "Most Viewed", "Most Downloaded"],
};

export default function DiscoveryPage() {
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
    clearOnDefault: true,
    throttleMs: 150,
  });
  const [categories, setCategories] = useState<string[]>([]);

  const { data: postsResponse } = useQuery({
    queryKey: ["posts", query],
    queryFn: () =>
      api.public.posts.get({
        query: {
          search: query as string,
          categories: categories as string[],
          limit: 25,
          page: 1,
        },
      }),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <main className="flex-1 min-w-0">
            <div className="flex flex-col gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                  Discover Artworks
                </h1>
                <p className="text-muted-foreground mt-2">
                  Explore amazing artworks from our community
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search artworks..."
                  className="pl-10 w-full"
                  defaultValue={query as string}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = categories.includes(
                    category.toLowerCase()
                  );
                  return (
                    <Button
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      className={
                        isSelected
                          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500"
                          : ""
                      }
                      onClick={() => {
                        if (isSelected) {
                          // Remove category
                          setCategories(
                            categories
                              .filter((c) => c !== category.toLowerCase())
                              .map((c) => c.toLowerCase())
                          );
                        } else {
                          // Add category
                          setCategories([
                            ...categories,
                            category.toLowerCase(),
                          ]);
                        }
                      }}
                    >
                      {category}
                    </Button>
                  );
                })}
              </div>
            </div>

            <ArtworkGrid posts={postsResponse?.data} />
          </main>
        </div>
      </div>
    </div>
  );
}
