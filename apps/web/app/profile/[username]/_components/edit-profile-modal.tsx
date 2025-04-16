"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image, Pencil, Upload, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { type UserType } from "@workspace/db/src/schema/users";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { UpdateAvatarCard, UpdateUsernameCard, UpdateNameCard, UpdateFieldCard, SettingsCard } from "@daveyplate/better-auth-ui";

interface EditProfileModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader className="flex justify-between items-center mb-4">
          <AlertDialogTitle className="absolute left-5 p-1 top-4">Edit Profile</AlertDialogTitle>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 absolute top-4 right-4 p-1 hover:cursor-pointer rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </AlertDialogHeader>
        <div className="space-y-4">

          <UpdateAvatarCard
            classNames={{
              avatar: {
                base: "cursor-pointer",
              },
            }}
          /> 

          <UpdateNameCard />

          <UpdateUsernameCard /> 

          <UpdateFieldCard
            field="bio"
            label="Bio"
            description="Update your bio"
            placeholder="Enter your bio"
            type="string"
          />

        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
