import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { MessageCircle, Globe, Twitter } from "lucide-react";
import React from "react";

export function ProfileCard() {
  // Mock data
  const links = [
    {
      icon: MessageCircle,
      label: "Discord",
      href: "https://discord.com/users/123456789012345678",
    },
    {
      icon: Twitter,
      label: "X (Twitter)",
      href: "https://x.com/dabbleart",
    },
    {
      icon: Globe,
      label: "Website",
      href: "https://dabble.art",
    },
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <CardTitle className="mb-4">Contact Info</CardTitle>
        <nav className="space-y-2">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
} 