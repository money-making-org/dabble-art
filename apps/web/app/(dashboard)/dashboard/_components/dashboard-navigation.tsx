import { Card } from "@workspace/ui/components/card";
import { Image, Users, Bookmark, List } from "lucide-react";

const navigationItems = [
  { name: "Gallery", icon: Image, key: "gallery" },
  { name: "Analytics", icon: Users, key: "analytics" },
  { name: "Favorites", icon: Bookmark, key: "favorites" },
  { name: "Revenue", icon: List, key: "revenue" },
];

interface DashboardNavigationProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardNavigation({ selectedTab, onTabChange }: DashboardNavigationProps) {
  return (
    <Card className="bg-card p-4 rounded-lg border">
      <h3 className="font-medium -mb-3">Navigation</h3>
      <div className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onTabChange(item.key)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
              ${selectedTab === item.key ? "bg-muted text-primary" : "hover:bg-muted"}`}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </button>
        ))}
      </div>
    </Card>
  );
} 