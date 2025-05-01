"use client";

import { useState } from "react";
import { Search, Bell, Mail, Home, Users, TrendingUp, Upload, User, LayoutDashboard, Star, Store } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import Logo from "@/components/logo";

export function MainNavigation() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "For You", href: "/explore", icon: Star},
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="w-full px-4">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center gap-6">
            <Logo />
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Dabble..."
                className="w-50 pl-9 focus-visible:ring-[#007FFF]"
              />
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.name}
                  variant={pathname === tab.href ? "default" : "ghost"}
                  className={cn(
                    "gap-2",
                    pathname === tab.href && "bg-[#007FFF] hover:bg-[#007FFF]/90"
                  )}
                  asChild
                >
                  <Link href={tab.href}>
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
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
                  href: `/profile/${session?.user?.username}`,
                  label: "Profile",
                  signedIn: true,
                  icon: <User />,
                },
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