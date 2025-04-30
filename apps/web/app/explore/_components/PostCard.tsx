import { useState } from "react";
import { Heart, MessageCircle, Repeat, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function PostCard({ post }: { post: any }) {
  if (!post || !post.files?.[0] || !post.owner) {
    return null;
  }

  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/posts/${post._id}/files/${post.files[0]._id}/download`;
  const username = post.owner.username || 'anonymous';
  const name = post.owner.name || username;
  const avatarUrl = post.owner.avatarUrl;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    // TODO: Implement repost functionality
  };

  return (
    <div className="bg-card rounded-lg border">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${username}`} className="font-medium hover:underline">
              {name}
            </Link>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span>@{username}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem>
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {post.description && (
          <p className="mt-3 text-sm whitespace-pre-wrap">{post.description}</p>
        )}
      </div>

      {/* Post Image */}
      <Link href={`/posts/${post._id}`}>
        <div className="relative aspect-[4/3] bg-muted">
          <img
            src={fileUrl}
            alt={post.name || 'Artwork'}
            className="w-full h-full object-contain"
          />
        </div>
      </Link>

      {/* Post Actions */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:text-red-500 transition-colors",
              isLiked && "text-red-500"
            )}
            onClick={handleLike}
          >
            <Heart className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/posts/${post._id}`}>
              <MessageCircle className="h-6 w-6" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:text-green-500 transition-colors",
              isReposted && "text-green-500"
            )}
            onClick={handleRepost}
          >
            <Repeat className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="font-medium">{post.likeCount || 0} likes</p>
          {post.tags?.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/?q=${tag}`}
                  className="hover:underline mr-2"
                >
                  #{tag}
                </Link>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 