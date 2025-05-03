"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";

interface EditArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: {
    _id: string;
    name: string;
    description?: string;
    tags?: string[];
  };
}

export function EditArtworkModal({ isOpen, onClose, post }: EditArtworkModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(post?.name || "");
  const [description, setDescription] = useState(post?.description || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?._id) return;
    
    setIsSubmitting(true);
    // TODO: Implement update functionality
    console.log("Update artwork:", { name, description, tags });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background rounded-lg p-6 w-full max-w-[425px]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Edit Artwork</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Title</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags separated by commas"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 