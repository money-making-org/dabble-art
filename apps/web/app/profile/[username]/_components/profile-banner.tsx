"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";

export const ProfileBanner = () => {
  const { data: session } = authClient.useSession();
  const params = useParams();
  const isOwnProfile = session?.user?.username === params.username;

  // Default banner image if none provided
  const bannerImage = "https://pingcraft.io/_app/immutable/assets/banner.AzxsXaih.png";

  return (
    <div className="relative h-48 md:h-64 w-full overflow-hidden -mt-16">
      <img
        src={bannerImage}
        alt="Profile banner"
        className="w-full h-full object-cover"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent" />
    </div>
  );
};
