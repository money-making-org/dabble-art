"use server";

import { ProfileBanner } from "./_components/profile-banner";
import ProfileHeader from "./_components/profile-header";
import ProfileTabs from "./_components/profile-tabs";
import { ProfileSidebar } from "./_components/profile-sidebar";
import { api } from "@workspace/eden";
import { headers } from "next/headers";
import { UserNotFound } from "./_components/user-not-found";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const headersList = await headers();
  const { data: user, error } = await api
    .users({ userId: params.username })
    .get({
      headers: {
        Cookie: headersList.get("Cookie") ?? "",
      },
    });

  if (error || !user) {
    return <UserNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileBanner />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          {/* Main Content */}
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <ProfileHeader user={user} />
            <ProfileTabs user={user} />
          </div>

          {/* Right Sidebar */}
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
}
