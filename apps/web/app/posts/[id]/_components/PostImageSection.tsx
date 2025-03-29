"use client";

import { ImageSwiper } from "@workspace/ui/components/image-swiper";
import { Bookmark } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface PostImageSectionProps {
  imageURLs: string[];
  postId: string;
  isBookmarked: boolean;
  onBookmark: () => void;
}

export function PostImageSection({
  imageURLs,
  postId,
  isBookmarked,
  onBookmark,
}: PostImageSectionProps) {
  if (!imageURLs || imageURLs.length === 0) {
    return (
      <div className="bg-muted rounded-lg flex items-center justify-center aspect-video">
        <p>No image available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <Button
        variant="outline"
        size="icon"
        className={`absolute top-4 right-4 z-10 rounded-full bg-background/70 hover:bg-background/90 ${isBookmarked ? "text-primary" : ""}`}
        onClick={onBookmark}
        aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Post"}
      >
        <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>

      {/* Image Swiper Integration */}
      <div className="w-full overflow-hidden rounded-lg bg-muted aspect-video">
        {imageURLs.length > 0 && (
          <ImageSwiper images={imageURLs} className="w-full h-full" />
        )}
      </div>
    </div>
  );
}
