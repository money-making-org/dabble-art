import useFollowToggle from "@/app/posts/[id]/_hooks/use-follow-toggle";
import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const FollowButton = ({
  userId,
  info,
}: {
  userId: string;
  info: {
    isFollowing: boolean;
    isFollowPending: boolean;
  };
}) => {
  const { toggleFollow, isPending: isFollowTogglePending } = useFollowToggle();
  const [isLocallyFollowing, setIsLocallyFollowing] = useState<boolean | null>(
    null
  );

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (info.isFollowing !== undefined && isLocallyFollowing === null) {
      setIsLocallyFollowing(info.isFollowing);
    }
  }, [info.isFollowing, isLocallyFollowing]);

  function isFollowing() {
    if (!userId) return false;
    if (isLocallyFollowing !== null) {
      return isLocallyFollowing;
    }
    return info.isFollowing;
  }

  const handleFollowToggle = () => {
    if (!session?.user) {
      toast.error("Please log in to follow users.");
      return;
    }
    if (isFollowTogglePending || !userId) return;

    const currentlyFollowing = isFollowing();
    setIsLocallyFollowing(!currentlyFollowing);

    toggleFollow(
      { userId: userId, isCurrentlyFollowing: currentlyFollowing },
      {
        onError: () => {
          setIsLocallyFollowing(currentlyFollowing);
          toast.error("Failed to update follow status.");
        },
      }
    );
  };

  return (
    <Button
      variant={isFollowing() ? "secondary" : "outline"}
      size="sm"
      onClick={handleFollowToggle}
      disabled={isFollowTogglePending}
    >
      {isFollowing() ? "Following" : "Follow"}
    </Button>
  );
};
