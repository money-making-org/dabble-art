"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthView({ pathname }: { pathname: string }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <main className="flex flex-col grow p-4 items-center justify-center">
      <AuthCard
        pathname={pathname}
        localization={{
          name: "Username",
          namePlaceholder: "Username",
        }}
      />
    </main>
  );
}
