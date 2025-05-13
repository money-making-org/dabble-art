import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { useState, useCallback } from "react";
import { NextGallery } from "@/components/next-gallery/NextGallery";

export interface Post {
  _id: string;
  owner: {
    _id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
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
  analytics?: {
    views: number;
    downloads: number;
  };
  likeCount?: number;
}

interface ArtworkGridProps {
  posts: Post[];
  className?: string;
  currentUserId?: string;
  onEdit?: (artwork: Post) => void;
  onDelete: (postId: string) => Promise<void>;
  isDeletePending?: boolean;
  showActions?: boolean;
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

export function ArtworkGrid({
  posts,
  className,
  currentUserId,
  onEdit,
  onDelete,
  isDeletePending = false,
  showActions = false,
}: ArtworkGridProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleDeleteClick = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setIsAlertOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedPostId) return;

    try {
      await onDelete(selectedPostId);
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setIsAlertOpen(false);
      setSelectedPostId(null);
    }
  }, [selectedPostId, onDelete]);

  if (!posts?.length) return null;

  const images = posts
    .filter(post => !!post.owner)
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
      <NextGallery
        images={images}
        breakpoints={[400, 800, 1200, 1600]}
        ratios={ratios}
        gap="4px"
        lastRowBehavior="match-previous"
        preferGrowing={1.2}
        shrinkLimit={0.7}
        overlay={(img) => {
          const post = img.metadata;
          if (!post) {
            console.log("No post");
            return null;
          }

          const isOwnArtwork = post.owner && currentUserId === post.owner._id;

          return (
            <Link
              href={`/posts/${post._id}`}
              className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              {showActions && isOwnArtwork && (
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(post);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      )}
                      <AlertDialog
                        open={isAlertOpen}
                        onOpenChange={setIsAlertOpen}
                      >
                        <AlertDialogTrigger
                          asChild
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(post._id);
                          }}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your post and remove its data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // setSelectedPostId(null)
                                setIsAlertOpen(false)
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteConfirm();
                              }}
                              disabled={isDeletePending}
                            >
                              {isDeletePending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <h3 className="font-semibold truncate text-white">{post.name}</h3>
              <Link
                href={`/profile/${post.owner?.username}`}
                className="group inline-block"
              >
                <p className="text-sm text-white/100 line-clamp-2 mt-1">
                  <span>@</span>
                  <span className="group-hover:underline">{post.owner?.username ?? "Unknown"}</span>
                </p>
              </Link>
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
