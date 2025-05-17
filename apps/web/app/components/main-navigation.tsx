"use client";

import { useState } from "react";
import { Search, Bell, Mail, Home, Users, TrendingUp, Upload, User, LayoutDashboard, Star, Store, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import Logo from "@/components/logo";
import HamburgerMenu from "./hamburger";

export function MainNavigation() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "For You", href: "/explore", icon: Star},
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Communities", href: "/communities", icon: Users },
  ];

  return (
    <div className="sticky top-0 z-999 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="w-full px-3">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center gap-6">
            <HamburgerMenu />
            <Logo />
            <div className="relative w-64 md:w-80 xl:w-48 hidden md:block md:absolute md:left-1/2 md:-translate-x-1/2 xl:static xl:translate-x-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Dabble..."
                className="w-full pl-9 focus-visible:ring-[#007FFF]"
              />
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="hidden xl:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
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

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-x-0 top-0 z-[1001] bg-background border-b h-16 flex items-center px-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Dabble..."
                  className="w-full pl-9 focus-visible:ring-[#007FFF]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 