"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@workspace/ui/components/card";
import { getPreviewURL } from "@/hooks/use-preview"; // Use absolute import

// Simplified Post type for the card
interface RelatedPost {
  _id: string;
  title: string;
  files: { _id: string; mimeType: string }[]; // Need at least one file ID and type
  owner: { name: string; id: string }; // Basic owner info
}

interface RelatedPostCardProps {
  post: RelatedPost;
}

export function RelatedPostCard({ post }: RelatedPostCardProps) {
  // Find the first image file for the preview
  const previewFile = post.files?.find((f) => f.mimeType.startsWith("image/"));
  const previewUrl = previewFile
    ? getPreviewURL(post._id, previewFile._id)
    : null; // Handle case with no image

  return (
    <Link href={`/posts/${post._id}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div
            className="w-full relative"
            style={{ paddingBottom: "100%" /* 1:1 Aspect Ratio container */ }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={post.title}
                fill
                className="absolute top-0 left-0 w-full h-full object-contain transition-transform group-hover:scale-105 p-4"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No Preview
              </div>
            )}
          </div>
          <div className="p-3 mt-auto">
            <h3 className="font-medium text-sm truncate group-hover:text-primary">
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              by {post.owner?.name ?? "Unknown Artist"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
