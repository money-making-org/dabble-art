import { api } from "@workspace/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useFollowToggle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      userId,
      isCurrentlyFollowing,
    }: {
      userId: string;
      isCurrentlyFollowing: boolean;
    }) => {
      if (isCurrentlyFollowing) {
        // Call the unfollow endpoint
        return api.users({ userId }).follow.delete();
      } else {
        // Call the follow endpoint
        return api.users({ userId }).follow.post();
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate queries that might be affected by the follow status change
      // Example: Invalidate the user profile query for the target user
      // to update their follower count.
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
      });

      // Example: Invalidate the current user's following list if you have one.
      // queryClient.invalidateQueries({ queryKey: ['currentUser', 'following'] });

      // Example: If the post query includes follower status, invalidate it too.
      // We might need to refine this later.
      // queryClient.invalidateQueries({ queryKey: ['post', postId] });

      console.log("Follow/Unfollow successful:", data);
    },
    onError: (error) => {
      // Handle error (e.g., show a notification to the user)
      console.error("Follow/Unfollow failed:", error);
      // Optionally: Revert optimistic updates if implemented
    },
  });

  return {
    toggleFollow: mutation.mutate,
    isPending: mutation.isPending,
  };
}
