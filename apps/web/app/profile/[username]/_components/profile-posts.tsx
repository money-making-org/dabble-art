"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Image, Link2, Smile } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { PostCard } from "@/app/explore/_components/PostCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { PostSkeleton } from "@/app/explore/_components/PostSkeleton";

export default function ProfilePosts() {
  const { data: session } = authClient.useSession();
  const params = useParams();
  const [postContent, setPostContent] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(loadMoreRef);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["posts", params.username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.public.posts.get({
        query: {
          sort: "latest",
          owner: params.username as string,
          page: pageParam,
          limit: 10,
        },
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const handlePost = () => {
    toast("Coming Soon", {
      description: "This feature hasn't been implemented yet.",
    });
  };

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-6">
      {/* Create Post Box */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="mb-3 border-none bg-muted/50"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  disabled={!postContent.trim()} 
                  onClick={handlePost}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        {isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground">No posts yet</div>
        ) : (
          <>
            {posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
            {isFetchingNextPage && <PostSkeleton />}
            <div ref={loadMoreRef} className="h-10" />
          </>
        )}
      </div>
    </div>
  );
} 