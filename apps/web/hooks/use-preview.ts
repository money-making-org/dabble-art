import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";

export function usePreview(postId: string, fileId: string) {
  return useQuery({
    queryKey: ["preview", postId, fileId],
    queryFn: () =>
      api.public.posts({ id: postId }).files({ fileId: fileId }).preview.get(),
  });
}

export function getPreviewURL(postId: string, fileId: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}/public/posts/${postId}/files/${fileId}/preview`;
}
