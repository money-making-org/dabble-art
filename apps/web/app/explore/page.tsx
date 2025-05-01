"use client";

import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@workspace/eden";
import { unstable_noStore } from "next/cache";
import { AdCard } from "@/components/ad-card";
import { PostSkeleton } from "./_components/PostSkeleton";
import { PostCard } from "./_components/PostCard";
import { ExploreNavbar } from "./_components/ExploreNavbar";
import { RightSidebar } from "./_components/RightSidebar";

export default function ExplorePage() {
  unstable_noStore();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(loadMoreRef);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "relevance">("latest");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["explore", sortBy],
    queryFn: ({ pageParam = 1 }) =>
      api.public.posts.get({
        query: {
          sort: sortBy,
          limit: 10,
          page: pageParam,
        },
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data || lastPage.data.length < 10) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2 mt-[-20px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Main Feed */}
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            {/* Posts */}
            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))
              ) : (
                <>
                  {data?.pages.map((page, i) => (
                    <div key={i} className="space-y-6">
                      {page?.data?.map((post: any) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                      {/* Insert ad after every 5 posts */}
                      {i % 5 === 4 && (
                        <AdCard
                          clientId="ca-pub-6714877547689628"
                          slotId="3489516387"
                        />
                      )}
                    </div>
                  ))}
                  {isFetchingNextPage && <PostSkeleton />}
                  <div ref={loadMoreRef} className="h-10" />
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
} 