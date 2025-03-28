import { api } from "@workspace/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLikePost() {
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending } = useMutation({
    mutationFn: async (id: string) =>
      await api.public.posts({ id }).like.post(),
  });

  return {
    likePost,
    isPending,
  };
}
