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
import { Search, Upload, Bell } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@daveyplate/better-auth-ui";

export function NavigationMenu() {
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/favicon.ico"
                  alt="dabble.art logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                dabble.art
              </span>
            </Link>
            <Nav>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/discover" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Discover
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/challenges" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Challenges
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/community" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
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
              <Input placeholder="Search artworks..." className="pl-8" />
            </div>
            <Link
              href="/upload"
              className="flex items-center gap-2 hover:bg-muted p-2 rounded-md"
            >
              <Upload className="size-5" />
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ModeToggle />
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
