import { Gallery } from "next-gallery";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

interface Post {
  _id: string;
  owner: string;
  name: string;
  description?: string;
  files: Array<{
    _id: string;
    owner: string;
    post: string;
    name: string;
    mimeType: string;
    bytes: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  }>;
  categories: string[];
  tags: string[];
  isPublic: boolean;
  isNsfw: boolean;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ArtworkGridProps {
  posts: Post[];
  className?: string;
}

interface GalleryImage {
  src: string;
  aspect_ratio: number;
  alt: string;
  nextImageProps: {
    priority: boolean;
  };
  metadata: Post;
}

export function ArtworkGrid({ posts, className }: ArtworkGridProps) {
  if (!posts?.length) return null;

  const images = posts
    .map((post) => {
      const file = post.files[0];
      if (!file) return null;

      const image: GalleryImage = {
        src: `${process.env.NEXT_PUBLIC_API_URL}/public/posts/${post._id.toString()}/files/${file._id.toString()}/download`,
        aspect_ratio: file.width / file.height,
        alt: post.name,
        nextImageProps: {
          priority: true,
          // @ts-ignore - It works
          className: "border rounded-md",
        },

        metadata: post,
      };
      return image;
    })
    .filter((img): img is GalleryImage => img !== null);

  if (!images.length) return null;

  // Calculate optimal ratios based on the actual image aspect ratios
  const aspectRatios = images.map((img) => img.aspect_ratio);
  const minRatio = Math.min(...aspectRatios);
  const maxRatio = Math.max(...aspectRatios);
  const avgRatio =
    aspectRatios.reduce((a, b) => a + b, 0) / aspectRatios.length;

  // Create a range of ratios that will work well with our images
  const ratios = [
    minRatio * 1.5,
    avgRatio * 2,
    avgRatio * 3,
    maxRatio * 2,
    maxRatio * 2.5,
  ];

  return (
    <div className={cn("w-full", className)}>
      <Gallery
        images={images}
        widths={[400, 800, 1200, 1600]}
        ratios={ratios}
        gap="4px"
        lastRowBehavior="match-previous"
        preferGrowing={1.2}
        shrinkLimit={0.7}
        overlay={(index) => {
          const post = posts[index];
          if (!post) return null;

          return (
            <Link
              href={`/posts/${post._id}`}
              className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              <h3 className="font-semibold truncate text-white">{post.name}</h3>
              {post.description && (
                <p className="text-sm text-white/90 line-clamp-2 mt-1">
                  {post.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        }}
      />
    </div>
  );
}
