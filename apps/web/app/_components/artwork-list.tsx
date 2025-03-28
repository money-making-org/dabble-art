"use client";

import { PostType } from "@workspace/db/src/schema/posts";

interface ArtworkListProps {
  posts?: PostType[];
}

export function ArtworkList({ posts = [] }: ArtworkListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="flex gap-4 p-4 bg-card rounded-lg border hover:border-primary transition-colors"
        >
          {post.files[0] && (
            <img
              src={`/api/files/${post.files[0]}/preview`}
              alt={post.name}
              className="w-48 h-32 object-cover rounded-md"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{post.name}</h3>
            {post.description && (
              <p className="text-muted-foreground mt-1">{post.description}</p>
            )}
            <div className="flex gap-2 mt-2">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="text-xs px-2 py-1 bg-muted rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
