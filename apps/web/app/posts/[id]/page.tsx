"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Heart,
  Share2,
  Download,
  MoreHorizontal,
  MessageCircle,
  Bookmark,
  Eye,
  ThumbsUp,
  Clock,
  Tag,
  Info,
  Grid,
  List,
  Filter,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ImageSwiper } from "@workspace/ui/components/image-swiper";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { NavigationMenu } from "@/app/components/navigation-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { getPreviewURL } from "@/hooks/use-preview";
import useLikePost from "@/app/posts/[id]/_hooks/use-like-post";
import { authClient } from "@/lib/auth-client";

function PostSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function ArtPiecePage() {
  const params = useParams();
  const { data: session } = authClient.useSession();

  const { data: post, isPending } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => api.public.posts({ id: params.id as string }).get(),
  });

  const [isLocallyLiked, setIsLocallyLiked] = useState<boolean | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const { likePost, isPending: isLikePending } = useLikePost();

  function isLikedInDB() {


    return (post?.data?.analytics?.likes || []).includes(session?.user?.id);
  }

  function isLiked() {
    if (isLocallyLiked === null) {
      return isLikedInDB();
    }
    return isLocallyLiked;
  }

  // Don't even ask me about this function
  function getLikesCount() {
    if (post?.data?.analytics === undefined || post?.data?.analytics.likesCount === undefined) {
      return 0;
    }

    const baseCount = post?.data?.analytics?.likesCount || 0;

    if (isLocallyLiked === null) {
      return baseCount;
    }

    if (isLikedInDB() && !isLocallyLiked) {
      return baseCount - 1;
    }

    if (!isLikedInDB() && isLocallyLiked) {
      return baseCount + 1;
    }

    return baseCount;
  }

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.data?.data],
    queryFn: () =>
      api.public.posts.get({
        query: {
          categories: post?.data?.categories,
          limit: 3,
          page: 1,
        },
      }),
    enabled: !!post?.data?.id,
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (!post || !post?.data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Post not found</h1>
            <p className="text-muted-foreground mt-2">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/discover">
              <Button className="mt-4">Discover More Art</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const postData = post.data;

  return (
    <Suspense>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <CardContent className="flex flex-col justify-between gap-4">
                <ImageSwiper
                  images={postData.files.map((file: any) =>
                    getPreviewURL(postData._id, file._id)
                  )}
                />
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border-2">
                        <AvatarImage
                          src={postData.owner.avatarUrl ?? ""}
                          alt={postData.owner.name}
                        />
                        <AvatarFallback>
                          {postData.owner.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium">
                        {postData.owner.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white hover:bg-white/10"
                        onClick={() => {
                          if (isLikePending) return;

                          setIsLocallyLiked(!isLiked());

                          likePost(postData._id);
                        }}
                        disabled={isLikePending}
                      >
                        <Heart
                          className={`h-5 w-5 ${isLiked() ? "fill-current text-red-500" : ""}`}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:text-white hover:bg-white/10"
                        onClick={() => setIsSaved(!isSaved)}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-white hover:bg-white/10"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Report</DropdownMenuItem>
                          <DropdownMenuItem>
                            Save to Collection
                          </DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Block Artist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                  {postData.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  {postData.description}
                </p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={postData.owner.avatarUrl}
                        alt={postData.owner.name}
                      />
                      <AvatarFallback>{postData.owner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-lg">
                        {postData.owner.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {postData.owner.bio}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          {postData.owner.followersCount?.toLocaleString() || 0}{" "}
                          followers
                        </span>
                        <span>{postData.owner.postsCount || 0} works</span>
                        {postData.owner.location && (
                          <span>{postData.owner.location}</span>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        Follow Artist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isLiked() ? "text-red-500 fill-current" : ""}
                    onClick={() => setIsLocallyLiked(!isLiked())}
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked() ? "fill-current" : ""}`}
                    />
                  </Button>
                  <span className="font-medium mt-1">
                    {getLikesCount().toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">Likes</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <span className="font-medium mt-1">
                    {postData.commentsCount || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Comments
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-5 w-5" />
                  </Button>
                  <span className="font-medium mt-1">
                    {(postData.analytics?.views ?? 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">Views</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <Button variant="ghost" size="icon">
                    <Download className="h-5 w-5" />
                  </Button>
                  <span className="font-medium mt-1">
                    {(postData.analytics?.downloads ?? 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Downloads
                  </span>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Posted{" "}
                        {formatDistanceToNow(new Date(postData.createdAt))} ago
                      </span>
                    </div>
                    {postData.categories?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span>{postData.categories.join(", ")}</span>
                      </div>
                    )}
                    {postData.dimensions && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span>{postData.dimensions}</span>
                      </div>
                    )}
                    {postData.license && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{postData.license}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {postData.tags && postData.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {postData.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  Share Artwork
                </Button>
              </div>
            </div>
          </div>

          {/* {relatedPosts?.data && relatedPosts.data.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  More from {postData.owner.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-4`}
              >
                {relatedPosts.data.map((work: any) => (
                  <Link key={work.id} href={`/posts/${work.id}`}>
                    <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <img
                            src={work.imageUrl}
                            alt={work.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-medium">
                              {work.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {work.author.name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Heart className="h-4 w-4 text-white" />
                              <span className="text-white text-sm">
                                {work.likesCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </Suspense>
  );
}
