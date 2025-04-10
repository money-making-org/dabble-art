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
import { Search, Upload, Bell, LayoutDashboard, Menu, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ThemeToggle } from "./theme-toggle";
import { UserButton } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import HamburgerMenu from "@/app/components/hamburger";
import Logo from "@/components/logo";
import { authClient } from "@/lib/auth-client";

export function NavigationMenu() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HamburgerMenu />
            <Logo />

            <div className="hidden md:block pl-4">
              <Nav>
                <NavItems />
              </Nav>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative w-32 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
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
              <Upload className="size-4 md:size-5" />
            </Link>
            <ThemeToggle />
            <UserButton
              className="cursor-pointer"
              additionalLinks={[
                {
                  href: "/dashboard",
                  label: "Dashboard",
                  signedIn: true,
                  icon: <LayoutDashboard />,
                },
                {
                  href: `/profile/${session?.user?.username}`,
                  label: "Profile",
                  signedIn: true,
                  icon: <User />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const NavItems = () => (
  <NavigationMenuList className="flex-col md:flex-row space-y-2 md:space-y-0">
    <NavigationMenuItem>
      <Link href="/" legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Explore
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Button
        variant="ghost"
        className={navigationMenuTriggerStyle()}
        onClick={() => toast.info("Challenges feature is coming soon!")}
      >
        Challenges
      </Button>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Button
        variant="ghost"
        className={navigationMenuTriggerStyle()}
        onClick={() => toast.info("Marketplace feature is coming soon!")}
      >
        Marketplace
      </Button>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <Link href="https://discord.gg/jG6gYzePmr" legacyBehavior passHref>
        <NavigationMenuLink
          className={navigationMenuTriggerStyle()}
          target="_blank"
        >
          Community
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  </NavigationMenuList>
);
