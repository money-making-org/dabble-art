"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { RelatedPostCard } from "@/app/posts/[id]/_components/RelatedPostCard";
import useFollowToggle from "@/app/posts/[id]/_hooks/use-follow-toggle";
import useLikePost from "@/app/posts/[id]/_hooks/use-like-post";
import { getPreviewURL } from "@/hooks/use-preview";
import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { PostDetailsSection } from "./_components/PostDetailsSection";
import { PostImageSection } from "./_components/PostImageSection";

function PostSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-square rounded-md" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function ArtPiecePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const postId = params.id as string;

  const { data: postResult, isPending: isPostPending } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.public.posts({ id: postId }).get(),
  });

  const [isLocallyLiked, setIsLocallyLiked] = useState<boolean | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);

  const { likePost, isPending: isLikePending } = useLikePost();

  const postData = postResult?.data;

  const { mutate: deletePost, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      const response = await api.public.posts({ id: postId }).delete();
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete post. Please try again.");
    },
  });

  function isLikedInDB() {
    return postData?.isLiked ?? false;
  }

  function isLiked() {
    if (isLocallyLiked === null) {
      return isLikedInDB();
    }
    return isLocallyLiked;
  }

  function getLikesCount() {
    return postData?.likeCount ?? 0;
  }

  const handleLike = () => {
    if (isLikePending || !postData?._id) return;

    const currentlyLiked = isLiked();
    setIsLocallyLiked(!currentlyLiked);

    likePost(postData._id, {
      onError: () => {
        setIsLocallyLiked(currentlyLiked);
        toast.error("Failed to update like status.");
      },
      onSuccess: (result) => {
        const successData = result?.data;
        if (successData && typeof successData.isLiked === "boolean") {
          setIsLocallyLiked(successData.isLiked);
        } else {
          console.warn("Like API response format unexpected:", result);
          setIsLocallyLiked(currentlyLiked);
        }
      },
    });
  };

  const handleDelete = async () => {
    deletePost();
  };

  const { data: relatedPostsResult, isPending: isRelatedPending } = useQuery({
    queryKey: ["related-posts", postId, postData?.categories],
    queryFn: () =>
      api.public.posts.get({
        query: {
          categories: postData?.categories,
          limit: 3,
          page: 1,
          excludeIds: [postId],
        },
      }),
    enabled:
      !!postData?._id &&
      !!postData?.categories &&
      postData.categories.length > 0,
  });

  if (isPostPending) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className=" bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Post not found</h1>
            <p className="text-muted-foreground mt-2">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageURLs = postData.files.map((file: any) =>
    getPreviewURL(postData._id, file._id)
  );

  const relatedPosts = relatedPostsResult?.data;

  return (
    <Suspense>
      <div className="bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
            <PostImageSection
              imageURLs={imageURLs}
              postId={postData._id}
              isBookmarked={isBookmarked}
              onBookmark={() => setIsBookmarked(!isBookmarked)}
            />

            <PostDetailsSection
              post={postData as any}
              isLiked={isLiked()}
              likeCount={getLikesCount()}
              onLike={handleLike}
              isLikePending={isLikePending}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              isDeletePending={isDeletePending}
            />
          </div>

          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post: any) => (
                  <RelatedPostCard key={post._id} post={post as any} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
