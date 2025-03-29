"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Send } from "lucide-react";

// Placeholder data - replace with actual fetching and state management
const comments = [
  {
    id: "1",
    author: "User A",
    text: "Great work!",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    author: "User B",
    text: "Love the colors.",
    timestamp: "1 hour ago",
  },
];

export function CommentsSection() {
  // TODO: Implement state for new comment input
  // TODO: Implement mutation for posting new comment
  // TODO: Implement query for fetching comments

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Comment Input */}
        <div className="flex gap-2">
          <Input placeholder="Add a comment..." />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Existing Comments List */}
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="text-sm">
              <p>
                <span className="font-semibold">{comment.author}: </span>
                {comment.text}
              </p>
              <p className="text-xs text-muted-foreground">
                {comment.timestamp}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
