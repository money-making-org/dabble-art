"use client";

import { treaty } from "@elysiajs/eden";
import { Button } from "@workspace/ui/components/button";
import { ElysiaApp } from "@workspace/api/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const queryClient = useQueryClient();
  const client = treaty<ElysiaApp>("localhost:3001");

  const { data: count } = useQuery({
    queryKey: ["count"],
    queryFn: async () =>
      await client.counting.index.get().then((res) => res.data),
  });

  const { mutate: increment } = useMutation({
    mutationFn: async () =>
      await client.counting.index.post().then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["count"] });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Dabble Count</h1>
        <p>{count}</p>
        <Button size="sm" onClick={() => increment()}>
          Increment
        </Button>
      </div>
    </div>
  );
}
