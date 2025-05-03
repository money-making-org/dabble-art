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
  
export default function HamburgerMenu() {
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 -mr-8 md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  );
}
