import { ArtworkGrid, Post } from "@/app/components/artwork-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function GalleryTab() {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "latest" | "popular">("latest");

  const { data: posts, isPending: isPostsPending } = useQuery({
    queryKey: ["posts", searchQuery, sortBy],
    queryFn: () =>
      api.public.posts.get({
        query: {
          sort: sortBy,
          owner: session?.user?.id,
        },
      }),
    enabled: !!session?.user?.id,
  });

  const handleDelete = async (postId: string) => {
    try {
      // TODO: update ui
      await api.public.posts({ id: postId }).delete()
      console.log("Delete post:", postId);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (isPostsPending) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  if (!posts?.data?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No artworks found. Start by uploading your first artwork!
      </div>
    );
  }

  return (
    <ArtworkGrid
      posts={posts.data as Post[]}
      currentUserId={session?.user?.id}
      onDelete={handleDelete}
      showActions={true}
    />
  );
} 