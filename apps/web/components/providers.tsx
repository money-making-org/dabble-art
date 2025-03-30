"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { api } from "@workspace/eden";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthUIProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        onSessionChange={() => router.refresh()}
        LinkComponent={Link}
        avatar
        uploadAvatar={async (file: File) => {
          const res = await api.auth.avatar.post({
            file,
          });

          return res.data?.url;
        }}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </AuthUIProvider>
    </NextThemesProvider>
  );
}
