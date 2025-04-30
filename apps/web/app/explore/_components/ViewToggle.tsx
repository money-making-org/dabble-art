import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface ViewToggleProps {
  view: "feed" | "grid";
  onViewChange: (view: "feed" | "grid") => void;
  sortBy: "latest" | "popular" | "relevance";
  onSortChange: (sort: "latest" | "popular" | "relevance") => void;
}

export function ViewToggle({ view, onViewChange, sortBy, onSortChange }: ViewToggleProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
          <SelectItem value="relevance">Relevant</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button
          variant={view === "feed" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewChange("feed")}
          className="rounded-lg"
        >
          <LayoutList className="h-5 w-5" />
        </Button>
        <Button
          variant={view === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewChange("grid")}
          className="rounded-lg"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
} 