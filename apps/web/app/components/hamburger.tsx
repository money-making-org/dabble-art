"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { NavigationMenu } from "@workspace/ui/components/navigation-menu";
import { NavItems } from "./navigation-menu";

export default function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader className="mb-6">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6">
          <NavigationMenu className="block">
            <NavItems />
          </NavigationMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
}
