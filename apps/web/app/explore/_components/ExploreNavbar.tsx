import { useState } from "react";
import { Search, Bell, Mail, Home, Users, TrendingUp } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import { DashboardSidebar } from "./DashboardSidebar";

export function ExploreNavbar() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            <DashboardSidebar />
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-[#007FFF] to-[#00BFFF] bg-clip-text text-transparent">
                dabble
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Button
                variant={activeTab === "for-you" ? "default" : "ghost"}
                className={cn(
                  "gap-2",
                  activeTab === "for-you" && "bg-[#007FFF] hover:bg-[#007FFF]/90"
                )}
                onClick={() => setActiveTab("for-you")}
              >
                <Home className="h-5 w-5" />
                <span>For You</span>
              </Button>
              <Button
                variant={activeTab === "following" ? "default" : "ghost"}
                className={cn(
                  "gap-2",
                  activeTab === "following" && "bg-[#007FFF] hover:bg-[#007FFF]/90"
                )}
                onClick={() => setActiveTab("following")}
              >
                <Users className="h-5 w-5" />
                <span>Following</span>
              </Button>
              <Button
                variant={activeTab === "trending" ? "default" : "ghost"}
                className={cn(
                  "gap-2",
                  activeTab === "trending" && "bg-[#007FFF] hover:bg-[#007FFF]/90"
                )}
                onClick={() => setActiveTab("trending")}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Trending</span>
              </Button>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists, tags, or posts..."
                className="w-full pl-9 focus-visible:ring-[#007FFF]"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5" />
            </Button>
            {session?.user ? (
              <UserButton />
            ) : (
              <Button asChild className="bg-gradient-to-r from-[#007FFF] to-[#00BFFF] hover:opacity-90">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 