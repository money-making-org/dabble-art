import { Card } from "@workspace/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { authClient } from "@/lib/auth-client";

export function StatsOverview() {
  const { data: session } = authClient.useSession();
  
  const { data: posts } = useQuery({
    queryKey: ["dashboard-posts", session?.user?.id],
    queryFn: () =>
      api.public.posts.get({
        query: {
          owner: session?.user?.id,
        },
      }),
    enabled: !!session?.user?.id,
  });

  const { data: likes } = useQuery({
    queryKey: ["dashboard-likes", session?.user?.id],
    queryFn: async () => {
      if (!posts?.data) return [];
      const likeCounts = await Promise.all(
        posts.data.map(async (post) => {
          const response = await api.public.posts({ id: post._id }).get();
          return (response.data as any)?.likeCount ?? 0;
        })
      );
      return likeCounts;
    },
    enabled: !!posts?.data,
  });

  const totalArtworks = posts?.data?.length ?? 0;
  const totalLikes = likes?.reduce((acc: number, count: number) => acc + count, 0) ?? 0;
  const totalViews = posts?.data?.reduce((acc: number, post) => acc + (post.analytics?.views ?? 0), 0) ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Artworks</h3>
        <p className="text-3xl font-bold">{totalArtworks}</p>
      </Card>
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Views</h3>
        <p className="text-3xl font-bold">{totalViews}</p>
      </Card>
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Likes</h3>
        <p className="text-3xl font-bold">{totalLikes}</p>
      </Card>
    </div>
  );
} 