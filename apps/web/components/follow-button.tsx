import { Button } from "@workspace/ui/components/button";
import { Heart } from "lucide-react";

export const FollowButton = ({
  userId,
  isFollowing,
  isFollowPending,
}: {
  userId: string;
  isFollowing: boolean;
  isFollowPending: boolean;
}) => {
  return (
    <Button variant="outline" size="sm">
      <Heart className="w-4 h-4 mr-2" />
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
