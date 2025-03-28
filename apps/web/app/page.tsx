"use server";

import { Button } from "@workspace/ui/components/button";
import { ArtworkGrid } from "./_components/artwork-grid";
import { NavigationMenu } from "./components/navigation-menu";
import { Sidebar } from "./components/sidebar";
import { api } from "@workspace/eden";
import Link from "next/link";

export default async function HomePage() {
  const { data: posts } = await api.public.posts.get({
    query: {
      limit: 25,
      page: 1,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                  Featured Artworks
                </h1>
                <p className="text-muted-foreground mt-2">
                  Discover and get inspired by today's top digital artists
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Most Recent</Button>
                <Button variant="outline">Most Popular</Button>
                <Link href="/upload">
                  <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                    Share Artwork
                  </Button>
                </Link>
              </div>
            </div>

            <ArtworkGrid posts={posts} />
          </main>
        </div>
      </div>
    </div>
  );
}
