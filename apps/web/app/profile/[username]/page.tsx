"use server";

import { ProfileBanner } from "@/app/profile/[username]/_components/profile-banner";
import ProfileGallery from "@/app/profile/[username]/_components/profile-gallery";
import ProfileHeader from "@/app/profile/[username]/_components/profile-header";
import { UserNotFound } from "@/app/profile/[username]/_components/user-not-found";
import { api } from "@workspace/eden";
import { headers } from "next/headers";
import { AdCard } from "@/components/ad-card";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ProfileCard } from "@/app/profile/[username]/_components/profile-card";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { data: user, error } = await api
    .users({ userId: (await params).username })
    .get({
      headers: {
        Cookie: (await headers()).get("Cookie") ?? "",
      },
    });

  if (error || !user) {
    return <UserNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Image */}
      <ProfileBanner />

      <div className="container mx-auto px-4 -mt-16 pb-8 relative z-10">
        {/* Profile Header full width */}
        <ProfileHeader user={user as any} />
        {/* Flex row for gallery and sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="flex-1">
            <ProfileGallery />
          </div>
          <div className="w-full lg:w-80 flex flex-col gap-6 mt-8 lg:mt-0">
            <ProfileCard user={user} />
            <AdCard clientId="ca-pub-6714877547689628" slotId="3489516387" />
          </div>
        </div>
      </div>
    </div>
  );
}
