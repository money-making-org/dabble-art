"use server";

import { api } from "@workspace/eden";

export default async function ProfilePage() {
  const user = await api.users({})

  return <div>ProfilePage</div>;
}
