import { useState } from "react";
import { Home, Globe, Users, Bookmark, List, Menu, Plus, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function DashboardSidebar() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Explore", icon: Globe, href: "/explore" },
    { name: "Following", icon: Users, href: "/following" },
    { name: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
    { name: "Lists", icon: List, href: "/lists" },
  ];

  const communityItems = [
    { name: "Digital Art", members: "125K" },
    { name: "Concept Art", members: "87K" },
    { name: "Character Design", members: "64K" },
    { name: "Fan Art", members: "92K" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-[#007FFF] to-[#00BFFF] bg-clip-text text-transparent">
                dabble
              </span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-4">
              {/* Main Navigation */}
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Communities */}
              <div className="space-y-2">
                <h3 className="px-3 text-sm font-medium text-muted-foreground">
                  Communities
                </h3>
                <div className="space-y-1">
                  {communityItems.map((item) => (
                    <Link
                      key={item.name}
                      href={`/c/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <span className="font-medium">r/{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.members}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Create Post */}
              <Button className="w-full gap-2" asChild>
                <Link href="/create">
                  <Plus className="h-5 w-5" />
                  Create Post
                </Link>
              </Button>
            </div>
          </div>

          {/* User Section */}
          <div className="border-t p-4">
            {session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{session.user.username}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 