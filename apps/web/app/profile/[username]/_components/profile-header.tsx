"use client";

import { MessageCircle, Palette, Heart, Eye, Download, Award, Star } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { User } from "better-auth";
import { ElysiaUser, type UserType } from "@workspace/db/src/schema/users";
import { Button } from "@workspace/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { FollowButton } from "@/components/follow-button";
import { EditProfileModal } from "./edit-profile-modal";
import { useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

export default function ProfileHeader({
  user,
}: {
  user: typeof authClient.$Infer.Session.user & {
    isFollowing: boolean;
    stats?: {
      followers: number;
      following: number;
      posts: number;
      views: number;
      downloads: number;
      likes: number;
    };
    badges?: {
      name: string;
      icon: string;
      description: string;
    }[];
  };
}) {
  const { data: session, error } = authClient.useSession();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Default badges if none provided
  const badges = user.badges ?? [
    {
      name: "Early Adopter",
      icon: "🌟",
      description: "Joined during beta",
    },
    {
      name: "Premium",
      icon: "⭐",
      description: "Premium member",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <Avatar className="size-32 border">
              <AvatarImage
                src={user?.image ?? ""}
                alt={user?.displayUsername ?? ""}
              />
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
              <h1 className="text-3xl font-bold">{user?.displayUsername}</h1>
              <p className="text-muted-foreground">@{user?.username}</p>
            </div>
            <div className="flex gap-2">
              {user?.id !== session?.user?.id && (error || session?.user?.id) && (
                <FollowButton
                  userId={user?.id}
                  info={{
                    isFollowing: user?.isFollowing,
                    isFollowPending: false,
                  }}
                />
              )}
              {user?.id === session?.user?.id && (
                <Button variant="outline" size="sm" onClick={() => setIsEditProfileModalOpen(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.bio && <p className="text-muted-foreground">{user?.bio}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.name} variant="secondary" className="gap-1">
                <span>{badge.icon}</span>
                {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 py-4 border-y">
        <div className="text-center">
          <p className="text-2xl font-bold">{user.stats?.posts ?? 0}</p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.stats?.followers ?? 0}</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.stats?.following ?? 0}</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.stats?.views ?? 0}</p>
          <p className="text-sm text-muted-foreground">Views</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.stats?.downloads ?? 0}</p>
          <p className="text-sm text-muted-foreground">Downloads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.stats?.likes ?? 0}</p>
          <p className="text-sm text-muted-foreground">Likes</p>
        </div>
      </div>

      <EditProfileModal user={user as unknown as UserType} isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} />
    </div>
  );
}
