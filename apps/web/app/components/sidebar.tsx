"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { 
  Paintbrush, 
  Camera, 
  Box, 
  Palette, 
  Pencil, 
  Monitor, 
  Trophy,
  TrendingUp,
  Users,
  Star,
  Flame,
  ArrowBigUp,
  Gift,
  Calendar
} from "lucide-react";

const trendingTags = [
  { name: "#DigitalArt", posts: "2.4k" },
  { name: "#Illustration", posts: "1.8k" },
  { name: "#ConceptArt", posts: "956" },
  { name: "#CharacterDesign", posts: "823" },
  { name: "#Animation", posts: "712" },
];

const topCommunities = [
  {
    name: "Character Artists",
    members: "45.2k",
    growth: "+12%",
    icon: "🎨"
  },
  {
    name: "Concept Art",
    members: "32.1k",
    growth: "+8%",
    icon: "🖌️"
  },
  {
    name: "Digital Painting",
    members: "28.9k",
    growth: "+15%",
    icon: "🎭"
  }
];

const upcomingEvents = [
  {
    title: "Character Design Challenge",
    date: "Mar 25",
    participants: 324,
  },
  {
    title: "Portfolio Review Day",
    date: "Mar 28",
    participants: 156,
  }
];

export function Sidebar() {
  return (
    <div className="w-80 space-y-6 p-4">
      <Card className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-teal-500/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">About dabble.art</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A community of artists sharing work, giving feedback, and growing together.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold">152k</p>
                <p className="text-xs text-muted-foreground">Artists</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">2.8M</p>
                <p className="text-xs text-muted-foreground">Artworks</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
              Create Post
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-pink-500" />
            Trending Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="flex items-center gap-1 hover:bg-pink-500/10 cursor-pointer"
              >
                {tag.name}
                <span className="text-xs text-muted-foreground">• {tag.posts}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowBigUp className="h-5 w-5 text-purple-500" />
            Top Communities
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {topCommunities.map((community, index) => (
            <div key={community.name} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-5">
                {index + 1}
              </span>
              <div className="text-2xl w-8">{community.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-sm">{community.name}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{community.members} members</span>
                  <span className="text-emerald-500">{community.growth}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Join
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-500" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{event.title}</h4>
                <Badge variant="outline">{event.date}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.participants} participating</span>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full">
            View All Events
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-teal-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-500" />
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm mb-4">
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Ad-free browsing
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Exclusive challenges
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-yellow-500" />
              Priority feedback
            </li>
          </ul>
          <Button variant="outline" className="w-full">
            Try Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 