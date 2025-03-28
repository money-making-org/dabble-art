"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export function NavigationMenu() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Dabble
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/discover">
              <Button variant="ghost">Discover</Button>
            </Link>
            <Link href="/following">
              <Button variant="ghost">Following</Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/upload">
            <Button>Share Artwork</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
