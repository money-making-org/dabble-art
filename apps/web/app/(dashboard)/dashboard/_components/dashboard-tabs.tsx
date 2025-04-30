import { AnalyticsTab } from "./analytics-tab";
import DashboardGallery from "./dashboard-gallery";
import { RevenueTab } from "./revenue-tab";
import type { Post } from "../../../components/artwork-grid";
import React from "react";

interface DashboardTabsProps {
  currentTab: string;
  stats: { views: number; downloads: number; likes: number };
  user: any;
  onEdit: (artwork: Post) => void;
  onDelete: (postId: string) => Promise<void>;
  isDeletePending: boolean;
}

export function DashboardTabs({ currentTab, stats, user, onEdit, onDelete, isDeletePending }: DashboardTabsProps) {
  switch (currentTab) {
    case "analytics":
      return <AnalyticsTab stats={stats || { views: 0, downloads: 0, likes: 0 }} />;
    case "revenue":
      return <RevenueTab />;
    case "gallery":
    default:
      return (
        <DashboardGallery 
          user={user} 
          onEdit={onEdit}
          onDelete={onDelete}
          isDeletePending={isDeletePending}
        />
      );
  }
} 