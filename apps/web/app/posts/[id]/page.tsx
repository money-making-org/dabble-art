"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Hash } from "lucide-react";

import { RelatedPostCard } from "@/app/posts/[id]/_components/RelatedPostCard";
import useFollowToggle from "@/app/posts/[id]/_hooks/use-follow-toggle";
import useLikePost from "@/app/posts/[id]/_hooks/use-like-post";
import { getPreviewURL } from "@/hooks/use-preview";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { PostDetailsSection } from "./_components/PostDetailsSection";
import { PostImageSection } from "./_components/PostImageSection";
import { EditArtworkModal } from "@/app/(dashboard)/dashboard/_components/edit-artwork-modal";
import { PostNotFound } from "./_components/post-not-found";
import { AdCard } from "@/components/ad-card";

function PostSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Main Feed */}
          <div className="space-y-8 max-w-2xl mx-auto w-full">
            {/* Post Content */}
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="w-full aspect-video" />
              <div className="p-6 border-t">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg border overflow-hidden">
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden md:block w-80">
            <div className="sticky top-20 space-y-6">
              {/* Artist Info */}
              <div className="bg-card p-4 rounded-lg border">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>

              {/* More from Artist */}
              <div className="bg-card p-4 rounded-lg border">
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-card p-4 rounded-lg border">
                <Skeleton className="h-5 w-20 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Ad Card */}
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [isLocallyLiked, setIsLocallyLiked] = useState<boolean | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);

  const postId = params.id as string;

  const { data: postResult, isPending: isPostPending } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.public.posts({ id: postId }).get(),
  });

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

  const { data: artistPostsResult } = useQuery({
    queryKey: ["artist-posts", postData?.owner?._id],
    queryFn: () =>
      api.public.posts.get({
        query: {
          owner: postData?.owner?._id,
          limit: 4,
          page: 1,
          excludeIds: [postId],
        },
      }),
    enabled: !!postData?.owner?._id,
  });

  const handleEdit = useCallback((artwork: any) => {
    setSelectedArtwork(artwork);
    setIsEditModalOpen(true);
  }, []);

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
    return <PostNotFound />;
  }

  const imageURLs = postData.files.map((file: any) =>
    getPreviewURL(postData._id, file._id)
  );

  const relatedPosts = relatedPostsResult?.data;

  return (
    <Suspense>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
            {/* Main Feed */}
            <div className="space-y-8 max-w-2xl mx-auto w-full">
              {/* Post Content */}
              <div className="bg-card rounded-lg border overflow-hidden">

                <PostImageSection
                  imageURLs={imageURLs}
                  postId={postData._id}
                  isBookmarked={isBookmarked}
                  onBookmark={() => setIsBookmarked(!isBookmarked)}
                />

                <div className="p-6 border-t">
                  <PostDetailsSection
                    post={postData}
                    isLiked={isLiked()}
                    likeCount={getLikesCount()}
                    onLike={handleLike}
                    isLikePending={isLikePending}
                    currentUserId={currentUserId}
                    onDelete={handleDelete}
                    isDeletePending={isDeletePending}
                    onEdit={handleEdit}
                  />
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Related Posts</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((post: any) => (
                      <RelatedPostCard key={post._id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden md:block w-80">
              <div className="sticky top-20 space-y-6">
                {/* Artist Info */}
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">About the Artist</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={postData.owner?.image} />
                      <AvatarFallback>{postData.owner?.name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/profile/${postData.owner?.username}`} className="font-medium hover:underline">
                        {postData.owner?.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        @{postData.owner?.username}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/profile/${postData.owner?.username}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>

                {/* More from Artist */}
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">More from {postData.owner?.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {artistPostsResult?.data?.map((post: any) => (
                      <Link key={post._id} href={`/posts/${post._id}`}>
                        <div className="aspect-square rounded-md overflow-hidden bg-muted">
                          <img
                            src={getPreviewURL(post._id, post.files[0]._id)}
                            alt={post.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {postData.tags?.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/?q=${tag}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{tag}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ad Card */}
                <AdCard
                  clientId="ca-pub-6714877547689628"
                  slotId="3489516387"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedArtwork && (
        <EditArtworkModal
          artwork={selectedArtwork}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedArtwork(null);
          }}
        />
      )}
    </Suspense>
  );
}
