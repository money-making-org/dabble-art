"use client";

import React from "react";
import { Heart, Share2, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface PostActionsProps {
  isLiked: boolean;
  onLike: () => void;
  isLikePending: boolean;
  // Add onShare prop if needed later
}

export function PostActions({
  isLiked,
  onLike,
  isLikePending,
}: PostActionsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      // Check if window exists (client-side)
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy URL: ", err);
          // Optionally provide user feedback about the error
        });
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        size="lg"
        className={`flex-1 gap-2 ${isLiked ? "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500" : ""}`}
        variant={isLiked ? "default" : "outline"}
        onClick={onLike}
        disabled={isLikePending}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        <span>{isLiked ? "Liked" : "Like"}</span>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1 gap-2"
        onClick={handleShare}
        disabled={copied}
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <Share2 className="h-5 w-5" />
        )}
        <span>{copied ? "Copied!" : "Share"}</span>
      </Button>
      {/* Optional: Add Download button */}
    </div>
  );
}
