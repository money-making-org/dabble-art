import { MessageCircle, Palette } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { User } from "better-auth";
import { ElysiaUser, type UserType } from "@workspace/db/src/schema/users";
import { Heart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export default function ProfileHeader({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <div className="relative">
          <Avatar className="size-32 border">
            <AvatarImage src={user?.image ?? ""} alt={user?.displayUsername} />
            <AvatarFallback>{user?.username?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground">
            <Palette className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {user?.displayUsername}
            </h1>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Follow
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user?.bio && <p className="text-muted-foreground">{user?.bio}</p>}
        </div>
      </div>
    </div>
  );
}
