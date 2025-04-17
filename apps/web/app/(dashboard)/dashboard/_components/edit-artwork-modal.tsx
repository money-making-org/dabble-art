"use client";

import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import type { Post } from "../../components/artwork-grid";
import { Input } from "@workspace/ui/components/input";

interface EditArtworkModalProps {
  artwork: Post;
  isOpen: boolean;
  onClose: () => void;
}

export function EditArtworkModal({ artwork, isOpen, onClose }: EditArtworkModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader className="flex justify-between items-center mb-4">
          <AlertDialogTitle className="absolute left-5 p-1 top-4">Edit Artwork</AlertDialogTitle>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 absolute top-4 right-4 p-1 hover:cursor-pointer rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </AlertDialogHeader>
        <div className="space-y-4">
            <Input type="text" placeholder="Title" />
            <Input type="text" placeholder="Description" />
            <Input type="text" placeholder="Tags" />    
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
} 