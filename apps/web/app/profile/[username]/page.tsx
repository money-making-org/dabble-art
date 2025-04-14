"use server";

import ProfileHeader from "@/app/profile/[username]/_components/profile-header";
import { UserNotFound } from "@/app/profile/[username]/_components/user-not-found";
import { api } from "@workspace/eden";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { data: user, error } = await api.users({ userId: (await params).username }).get();

  if (error) {
    return <UserNotFound />
  }

  return (
    <div>
      <ProfileHeader user={user} />
    </div>
  );
}
