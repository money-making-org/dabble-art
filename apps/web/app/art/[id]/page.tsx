"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Heart, Share2, Download, MoreHorizontal, MessageCircle, Bookmark, Eye, ThumbsUp, Clock, Tag, Info, Grid, List, Filter } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { NavigationMenu } from "@/app/components/navigation-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Separator } from "@workspace/ui/components/separator"

const mockArtPiece = {
  id: "1",
  title: "Abstract Harmony",
  description: "A vibrant exploration of color and form, creating a sense of movement and balance.",
  artist: {
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    bio: "Digital artist specializing in abstract and contemporary art.",
    followers: 12345,
    works: 234,
    location: "San Francisco, CA",
    website: "https://sarahchen.art",
  },
  imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  likes: 1234,
  downloads: 567,
  comments: 89,
  views: 45678,
  tags: ["#DigitalArt", "#Abstract", "#Contemporary", "#Colorful", "#Illustration", "#ConceptArt"],
  createdAt: "2024-03-26",
  tools: ["Photoshop", "Illustrator", "Procreate"],
  resolution: "4000x3000px",
  category: "Digital Art",
  license: "All Rights Reserved",
  relatedWorks: [
    {
      id: "2",
      title: "Color Theory",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      artist: "Sarah Chen",
      likes: 892,
    },
    {
      id: "3",
      title: "Digital Dreams",
      image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800",
      artist: "Sarah Chen",
      likes: 756,
    },
    {
      id: "4",
      title: "Abstract Flow",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
      artist: "Sarah Chen",
      likes: 654,
    },
  ],
}

export default function ArtPiecePage() {
  const params = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={mockArtPiece.imageUrl}
                  alt={mockArtPiece.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={mockArtPiece.artist.avatar} alt={mockArtPiece.artist.name} />
                      <AvatarFallback>{mockArtPiece.artist.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{mockArtPiece.artist.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/10"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Save to Collection</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Block Artist</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                {mockArtPiece.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">{mockArtPiece.description}</p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockArtPiece.artist.avatar} alt={mockArtPiece.artist.name} />
                    <AvatarFallback>{mockArtPiece.artist.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{mockArtPiece.artist.name}</p>
                    <p className="text-sm text-muted-foreground">{mockArtPiece.artist.bio}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{mockArtPiece.artist.followers.toLocaleString()} followers</span>
                      <span>{mockArtPiece.artist.works} works</span>
                      <span>{mockArtPiece.artist.location}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Follow Artist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Button
                  variant="ghost"
                  size="icon"
                  className={isLiked ? "text-red-500" : ""}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <span className="font-medium mt-1">{mockArtPiece.likes + (isLiked ? 1 : 0)}</span>
                <span className="text-xs text-muted-foreground">Likes</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <span className="font-medium mt-1">{mockArtPiece.comments}</span>
                <span className="text-xs text-muted-foreground">Comments</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Button variant="ghost" size="icon">
                  <Eye className="h-5 w-5" />
                </Button>
                <span className="font-medium mt-1">{mockArtPiece.views.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">Views</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Button variant="ghost" size="icon">
                  <Download className="h-5 w-5" />
                </Button>
                <span className="font-medium mt-1">{mockArtPiece.downloads}</span>
                <span className="text-xs text-muted-foreground">Downloads</span>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Posted {mockArtPiece.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>{mockArtPiece.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>{mockArtPiece.resolution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{mockArtPiece.license}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mockArtPiece.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500">
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                Share Artwork
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">More from {mockArtPiece.artist.name}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-4`}>
            {mockArtPiece.relatedWorks.map((work) => (
              <Card key={work.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-medium">{work.title}</h3>
                      <p className="text-white/80 text-sm">{work.artist}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Heart className="h-4 w-4 text-white" />
                        <span className="text-white text-sm">{work.likes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 