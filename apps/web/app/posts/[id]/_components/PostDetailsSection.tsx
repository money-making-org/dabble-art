"use client";

import { PostActions } from "@/app/posts/[id]/_components/PostActions";
import { PostStats } from "@/app/posts/[id]/_components/PostStats";
import { PostType } from "@workspace/db/src/schema/posts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

// Define the props interface
interface PostDetailsSectionProps {
  post: PostType;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  isLikePending: boolean;
  isFollowing: boolean;
  isFollowPending: boolean;
  onFollowToggle: () => void;
  currentUserId?: string; // Add current user ID prop
}

// Export the component function
export function PostDetailsSection({
  post,
  isLiked,
  likeCount,
  onLike,
  isLikePending,
  isFollowing,
  isFollowPending,
  onFollowToggle,
  currentUserId,
}: PostDetailsSectionProps) {
  const isOwnPost = currentUserId === post.owner._id;

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
        {post.title}
      </h1>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Link
          href={`/profile/${post.owner.username}`}
          aria-label={`View profile of ${post.owner.name}`}
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={post.owner.avatarUrl ?? ""}
              alt={post.owner.name}
            />
            <AvatarFallback>{post.owner.name[0] || "?"}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col flex-grow">
          <Link
            href={`/profile/${post.owner.username}`}
            className="font-semibold hover:underline"
          >
            {post.owner.name}
          </Link>
          <span className="text-sm text-muted-foreground">
            {/* Placeholder for follower count */}
          </span>
        </div>

        {/* Conditionally render Follow Button */}
        {!isOwnPost && (
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            onClick={onFollowToggle}
            disabled={isFollowPending}
          >
            {isFollowPending ? "..." : isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </div>

      {/* Description */}
      {post.description && (
        <p className="text-foreground/80 text-base whitespace-pre-wrap">
          {post.description}
        </p>
      )}

      {/* Tags & Categories */}
      {(post.tags?.length || 0 > 0 || post.categories?.length || 0 > 0) && (
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((tag: string) => (
            <Badge
              key={`cat-${tag}`}
              variant="secondary"
              className="capitalize"
            >
              {tag.replace("-", " ")}
            </Badge>
          ))}
          {post.tags?.map((tag: string) => (
            <Badge key={`tag-${tag}`} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <PostStats
        views={post.analytics?.views}
        likes={likeCount}
        comments={post.commentsCount}
        createdAt={post.createdAt}
      />

      {/* Action Buttons */}
      <PostActions
        isLiked={isLiked}
        onLike={onLike}
        isLikePending={isLikePending}
        // Pass share handler if needed
      />
    </div>
  );
}
