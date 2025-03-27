import { X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

interface ImageGridProps {
  images: Array<{
    preview: string;
    name: string;
  }>;
  onRemove?: (name: string) => void;
  className?: string;
}

export function ImageGrid({ images, onRemove, className }: ImageGridProps) {
  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]",
        className
      )}
    >
      {images.map((image) => (
        <div
          key={image.name}
          className={cn(
            "group relative rounded-lg overflow-hidden",
            // If it's the first image and there are exactly 3 images, make it span 2 rows
            images.length === 3 && images[0] === image && "row-span-2",
            // If it's the first image and there are more than 4 images, make it span 2 rows and 2 columns
            images.length >= 4 && images[0] === image && "row-span-2 col-span-2"
          )}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.preview}
              alt={image.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(image.name)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-[1]" />
        </div>
      ))}
    </div>
  );
}
