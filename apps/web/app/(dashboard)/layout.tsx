import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {data: session, error} = await authClient.getSession();
  if (!session) {
    redirect("/auth/sign-in");
  }

  console.log(session);

  return <>{children}</>;
}
