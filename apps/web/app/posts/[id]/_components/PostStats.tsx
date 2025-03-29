"use client";

import React from "react";
import { Eye, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostStatsProps {
  views?: number;
  likes?: number;
  comments?: number;
  createdAt?: string;
}

export function PostStats({
  views = 0,
  likes = 0,
  comments = 0,
  createdAt,
}: PostStatsProps) {
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Unknown date";

  const statsItems = [
    { icon: Eye, label: "Views", value: views.toLocaleString() },
    { icon: ThumbsUp, label: "Likes", value: likes.toLocaleString() },
    {
      icon: MessageCircle,
      label: "Comments",
      value: comments?.toLocaleString() ?? 0,
    },
    { icon: Clock, label: "Uploaded", value: timeAgo },
  ];

  return (
    <div className="flex flex-wrap items-center justify-around gap-x-6 gap-y-4 py-4 px-2 border-t border-b border-border/60 bg-background">
      {statsItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
            <span className="font-semibold text-foreground order-1 sm:order-none">
              {item.value}
            </span>
            <span className="text-xs text-muted-foreground order-none sm:order-1">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
