"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  NavigationMenu as Nav,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { Search, Upload, Bell, LayoutDashboard } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ThemeToggle } from "./theme-toggle";
import { UserButton } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavigationMenu() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" prefetch className="flex items-center gap-0">
              <Image
                src="/logotest2.png"
                alt="dabble.art logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
              <span
                className="font-bold text-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent -ml-2"
              >
                dabble
              </span>
            </Link>

            <Nav>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Explore
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      href="/"
                    >
                      Challenges
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Marketplace
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="https://discord.gg/jG6gYzePmr"
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      target="_blank"
                    >
                      Community
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </Nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    router.push(`/?q=${searchQuery}`);
                  }
                }}
              />
            </div>
            <Link
              href="/upload"
              className="flex items-center gap-2 hover:bg-muted p-2 rounded-md"
            >
              <Upload className="size-5" />
            </Link>
            <ThemeToggle />
            <UserButton className="cursor-pointer"
            additionalLinks={[
              {
                href: "/dashboard",
                label: "Dashboard",
                signedIn: true,
                icon: <LayoutDashboard />,
              },
            ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
