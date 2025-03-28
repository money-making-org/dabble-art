import { api } from "@workspace/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useLikePost() {
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending } = useMutation({
    mutationFn: async (id: string) =>
      await api.public.posts({ id }).like.post(),

    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["post", data.data._id],
      });
    },
  });

  return {
    likePost,
    isPending,
  };
}
