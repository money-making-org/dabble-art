import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface CategoriesScrollProps {
  categories: string[];
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
}

export function CategoriesScroll({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesScrollProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        <Button
          variant={selectedCategory === undefined ? "default" : "outline"}
          onClick={() => onSelectCategory(undefined)}
          className="rounded-full"
          size="sm"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onSelectCategory(category)}
            className="rounded-full"
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}
