import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { AdCard } from "@/components/ad-card";

interface ArtGridProps {
  posts: any[];
  isLoading?: boolean;
}

function MiniAdCard() {
  return (
    <div className="relative break-inside-avoid mb-2 rounded-lg overflow-hidden bg-card">
      <AdCard
        clientId="ca-pub-6714877547689628"
        slotId="3489516387"
        className="!rounded-none !border-0"
      />
    </div>
  );
}

function ArtGridSkeleton() {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="relative break-inside-avoid mb-2 rounded-lg bg-muted animate-pulse"
          style={{ paddingBottom: "133%" }}
        />
      ))}
    </div>
  );
}

export function ArtGrid({ posts, isLoading }: ArtGridProps) {
  if (isLoading) {
    return <ArtGridSkeleton />;
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-2">
      {posts.map((post, index) => {
        if (!post?.files?.[0]?._id) return null;
        
        const username = post.owner?.username || 'anonymous';
        const name = post.owner?.name || username;
        const avatarUrl = post.owner?.avatarUrl;

        // Insert ad card every 10 items (but not at index 0)
        const shouldShowAd = index > 0 && index % 10 === 0;

        return (
          <>
            {shouldShowAd && <MiniAdCard />}
            <Link
              key={post._id}
              href={`/posts/${post._id}`}
              className="group relative block mb-2 break-inside-avoid"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/public/posts/${post._id}/files/${post.files[0]._id}/download`}
                  alt={post.name || 'Artwork'}
                  className="w-full h-auto"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{name}</p>
                        <p className="text-xs opacity-75">@{username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{post.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </>
        );
      })}
    </div>
  );
} 