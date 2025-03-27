"use client";

import { Button } from "@workspace/ui/components/button";
import { ArtworkGrid } from "./components/artwork-grid";
import { NavigationMenu } from "./components/navigation-menu";
import { Sidebar } from "./components/sidebar";
import { api } from "@workspace/eden";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function HomePage() {
  const {
    data: posts,
    error,
    isPending,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.public.posts.get(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <main className="flex-1">
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
                <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                  Share Artwork
                </Button>
              </div>
            </div>
            {/* <ArtworkGrid /> */}

            {posts?.data?.map((post) => (
              <div key={post._id}>
                {post.files.map((file) => (
                  <Image
                    key={file._id}
                    src={`http://localhost:3001/public/posts/${post._id}/files/${file._id}/preview`}
                    width={file.width}
                    height={file.height}
                    alt={file.name}
                  />
                ))}
              </div>
            ))}
          </main>
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
