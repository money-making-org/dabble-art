import { Card } from "@workspace/ui/components/card";
import { Image, Users, Bookmark, List } from "lucide-react";
import { GalleryTab } from "./tabs/gallery-tab";
import { AnalyticsTab } from "./tabs/analytics-tab";
import { FavoritesTab } from "./tabs/favorites-tab";
import { RevenueTab } from "./tabs/revenue-tab";

const navigationItems = [
  { name: "Gallery", icon: Image, key: "gallery" },
  { name: "Analytics", icon: Users, key: "analytics" },
  { name: "Favorites", icon: Bookmark, key: "favorites" },
  { name: "Revenue", icon: List, key: "revenue" },
];

interface TabContentProps {
  selectedTab: string;
}

export function TabContent({ selectedTab }: TabContentProps) {
  const renderContent = () => {
    switch (selectedTab) {
      case "gallery":
        return <GalleryTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "favorites":
        return <FavoritesTab />;
      case "revenue":
        return <RevenueTab />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold mb-4">
        {navigationItems.find(i => i.key === selectedTab)?.name}
      </h2>
      {renderContent()}
    </Card>
  );
} 