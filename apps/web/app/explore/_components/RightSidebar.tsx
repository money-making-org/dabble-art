import { Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { AdCard } from "@/components/ad-card";
import { trendingTags, suggestedUsers } from "./data";

export function RightSidebar() {
  return (
    <div className="hidden md:block w-80">
      <div className="sticky top-29.5 space-y-4">
        {/* Trending Tags */}
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Trending Tags</h3>
          <div className="space-y-3">
            {trendingTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/?q=${tag.name}`}
                className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">#{tag.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{tag.count}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Who to Follow */}
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Who to Follow</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.username} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Follow
                </Button>
              </div>
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
  );
} 