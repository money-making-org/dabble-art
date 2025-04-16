"use server";

import { ProfileBanner } from "@/app/profile/[username]/_components/profile-banner";
import ProfileGallery from "@/app/profile/[username]/_components/profile-gallery";
import ProfileHeader from "@/app/profile/[username]/_components/profile-header";
import { UserNotFound } from "@/app/profile/[username]/_components/user-not-found";
import { api } from "@workspace/eden";
import { headers } from "next/headers";

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
        <div className="space-y-8">
          <ProfileHeader user={user as any} />
          <ProfileGallery />
        </div>
      </div>
    </div>
  );
}
