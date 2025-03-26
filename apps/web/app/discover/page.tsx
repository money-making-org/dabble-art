"use client"

import { useState } from "react"
import { Grid, List, Filter, SlidersHorizontal, Search, ChevronDown } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ArtworkGrid } from "../components/artwork-grid"
import { ArtworkList } from "../components/artwork-list"
import { NavigationMenu } from "../components/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

const categories = [
  "All",
  "Digital Art",
  "Illustration",
  "Photography",
  "3D Art",
  "Concept Art",
  "Character Design",
  "Environment Art",
  "Animation",
  "UI/UX Design",
]

const filters = {
  style: ["Realistic", "Abstract", "Cartoon", "Anime", "Pixel Art", "Minimalist"],
  color: ["Colorful", "Monochrome", "Warm", "Cool", "Pastel", "Neon"],
  medium: ["Digital", "Traditional", "3D", "Photography", "Mixed Media"],
  time: ["Latest", "Most Popular", "Most Viewed", "Most Downloaded"],
}

export default function DiscoverPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return {
        ...prev,
        [category]: updated
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
            Discover Art
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore and discover amazing artworks from talented artists
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks, artists, or tags..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Artworks</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  <div className="space-y-6">
                    {Object.entries(filters).map(([key, values]) => (
                      <div key={key}>
                        <h3 className="text-sm font-medium mb-2 capitalize">{key}</h3>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value) => (
                            <Badge
                              key={value}
                              variant={selectedFilters[key]?.includes(value) ? "default" : "secondary"}
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => toggleFilter(key, value)}
                            >
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between">
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
            </div>
            <Select defaultValue="latest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="most-viewed">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewMode === "grid" ? <ArtworkGrid /> : <ArtworkList />}
      </div>
    </div>
  )
} 