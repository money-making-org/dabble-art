"use client";

import { useState } from "react";
import { ImageSwiper } from "@workspace/ui/components/image-swiper";
import { Bookmark } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image"; // Using next/image for potential optimization

interface PostImageSectionProps {
  imageURLs: string[];
  postId: string; // Assuming needed for bookmarking perhaps?
  isBookmarked: boolean;
  onBookmark: () => void;
}

export function PostImageSection({
  imageURLs,
  postId,
  isBookmarked,
  onBookmark,
}: PostImageSectionProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!imageURLs || imageURLs.length === 0) {
    return (
      <div className="bg-muted rounded-lg flex items-center justify-center aspect-video">
        <p>No image available</p>
      </div>
    );
  }

  const activeImageUrl = imageURLs[activeImageIndex]; // Get current URL

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Bookmark Button (Positioned top-right) */}
      <Button
        variant="outline"
        size="icon"
        className={`absolute top-4 right-4 z-10 rounded-full bg-background/70 hover:bg-background/90 ${isBookmarked ? "text-primary" : ""}`}
        onClick={onBookmark}
        aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Post"}
      >
        <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>

      {/* Main Image Display - Using div for aspect ratio */}
      <div
        className="w-full relative overflow-hidden rounded-lg bg-muted"
        style={{ paddingBottom: "56.25%" /* 16:9 Aspect Ratio */ }}
      >
        {activeImageUrl && ( // Check if URL exists
          <Image
            src={activeImageUrl} // Use the checked URL
            alt={`Post image ${activeImageIndex + 1}`}
            fill
            className="absolute top-0 left-0 w-full h-full object-cover"
            priority={activeImageIndex === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        )}
      </div>

      {/* Thumbnails */}
      {imageURLs.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imageURLs.map((url, index) => {
            const thumbnailUrl = url; // Assign for clarity
            return (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${index === activeImageIndex ? "ring-2 ring-primary ring-offset-2" : ""}`}
              >
                {/* Thumbnail Aspect Ratio Div */}
                <div
                  className="w-full relative"
                  style={{ paddingBottom: "100%" /* 1:1 Aspect Ratio */ }}
                >
                  {thumbnailUrl && ( // Check URL
                    <Image
                      src={thumbnailUrl} // Use checked URL
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      sizes="20vw"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Image Swiper (Optional - kept commented out for now) */}
      {/* {imageURLs.length > 1 && (
        <ImageSwiper
          images={imageURLs}
          activeIndex={activeImageIndex}
          onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
        />
      )} */}
    </div>
  );
}
