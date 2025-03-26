import { Card, CardContent } from "@workspace/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

const artworks = [
  {
    id: 1,
    title: "Neon Dreams",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    artist: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    likes: 1234,
    comments: 56,
    tags: ["#DigitalArt", "#Cyberpunk"],
    featured: true,
  },
  {
    id: 2,
    title: "Urban Solitude",
    image: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=800",
    artist: {
      name: "Mike Rivers",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    likes: 892,
    comments: 34,
    tags: ["#Photography", "#Urban"],
    featured: true,
  },
  {
    id: 3,
    title: "Digital Wilderness",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
    artist: {
      name: "Elena Sky",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    likes: 2156,
    comments: 89,
    tags: ["#Landscape", "#DigitalArt"],
    featured: false,
  },
  {
    id: 4,
    title: "Mystic Portal",
    image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800",
    artist: {
      name: "Alex Zhang",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
    },
    likes: 1567,
    comments: 42,
    tags: ["#Fantasy", "#Illustration"],
    featured: true,
  },
  {
    id: 5,
    title: "Crystal Dreams",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    artist: {
      name: "Luna Park",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    },
    likes: 3421,
    comments: 156,
    tags: ["#Abstract", "#DigitalArt"],
    featured: true,
  },
  {
    id: 6,
    title: "Future City",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
    artist: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    likes: 982,
    comments: 45,
    tags: ["#Cyberpunk", "#ConceptArt"],
    featured: false,
  },
  {
    id: 7,
    title: "Ethereal Dance",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    artist: {
      name: "Maya Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    },
    likes: 4231,
    comments: 167,
    tags: ["#Animation", "#CharacterArt"],
    featured: true,
  },
  {
    id: 8,
    title: "Quantum Echoes",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
    artist: {
      name: "Kai Anderson",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
    },
    likes: 2789,
    comments: 98,
    tags: ["#Experimental", "#DigitalArt"],
    featured: true,
  },
  {
    id: 9,
    title: "Neon Samurai",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
    artist: {
      name: "Ryu Tanaka",
      avatar: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=100",
    },
    likes: 5632,
    comments: 234,
    tags: ["#Cyberpunk", "#CharacterDesign"],
    featured: true,
  },
  {
    id: 10,
    title: "Desert Mirage",
    image: "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?w=800",
    artist: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100",
    },
    likes: 1876,
    comments: 76,
    tags: ["#Landscape", "#ConceptArt"],
    featured: false,
  },
  {
    id: 11,
    title: "Biomech Evolution",
    image: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=800",
    artist: {
      name: "Marcus Black",
      avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100",
    },
    likes: 3102,
    comments: 143,
    tags: ["#SciFi", "#3DArt"],
    featured: true,
  },
  {
    id: 12,
    title: "Spirit Garden",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    artist: {
      name: "Yuki Yamamoto",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    },
    likes: 2543,
    comments: 112,
    tags: ["#Fantasy", "#EnvironmentArt"],
    featured: true,
  }
];

export function ArtworkGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Link 
          key={artwork.id} 
          href={`/art/${artwork.id}`}
          className="block transition-transform duration-300 hover:-translate-y-1"
        >
          <Card className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault(); 
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="mb-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-white/20">
                      <AvatarImage src={artwork.artist.avatar} />
                      <AvatarFallback>{artwork.artist.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{artwork.artist.name}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {artwork.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{artwork.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{artwork.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 