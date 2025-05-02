"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Card } from "@workspace/ui/components/card";
import { UserType } from "@workspace/db/src/schema/users";
import ProfilePosts from "./profile-posts";
import ProfileGallery from "./profile-gallery";

export default function ProfileTabs({
  user,
}: {
  user: UserType & {
    isFollowing: boolean;
  };
}) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="collections">Collections</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-6">
        <ProfilePosts />
      </TabsContent>
      <TabsContent value="about" className="mt-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </Card>
      </TabsContent>
      <TabsContent value="gallery" className="mt-6">
        <ProfileGallery />
      </TabsContent>
      <TabsContent value="collections" className="mt-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Collections</h2>
          <p className="text-muted-foreground">Feature coming soon...</p>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 