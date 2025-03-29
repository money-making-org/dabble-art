"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const categories = [
  "digital-art",
  "photography",
  "illustration",
  "character-design",
  "UI-UX",
  "logo",
  "fan-art",
  "3d",
  "anime",
  "realistic",
  "nude",
  "other",
] as const;

const uploadSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  categories: z
    .array(z.enum(categories))
    .min(1, "Select at least one category"),
  tags: z
    .array(z.string().min(2).max(20))
    .min(1, "At least one tag is required")
    .max(10),
  isPublic: z.boolean(),
  isNsfw: z.boolean(),
  isAiGenerated: z.boolean(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface FileWithPreview extends File {
  preview: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      isPublic: true,
      isNsfw: false,
      isAiGenerated: false,
      categories: [],
      tags: [],
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) =>
      [...prev, ...acceptedFiles].map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: true,
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = getValues("tags") || [];

      if (currentTags.length >= 10) {
        toast.error("Maximum tags reached", {
          description: "You can only add up to 10 tags",
        });
        return;
      }
      if (tagInput.length < 2 || tagInput.length > 20) {
        toast.error("Invalid tag length", {
          description: "Tags must be between 2 and 20 characters",
        });
        return;
      }

      const newTag = tagInput.trim();
      if (!currentTags.includes(newTag)) {
        setValue("tags", [...currentTags, newTag], {
          shouldValidate: true,
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = getValues("tags");
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: UploadFormData) => {
    if (files.length === 0) {
      toast.error("No files selected", {
        description: "Please select at least one image to upload",
      });
      return;
    }

    try {
      const uploadData = {
        name: data.name,
        description: data.description,
        categories: data.categories,
        tags: data.tags,
        isPublic: data.isPublic.toString(),
        isNsfw: data.isNsfw.toString(),
        isAiGenerated: data.isAiGenerated.toString(),
        files: files,
      };

      // @ts-ignore - We need to forcefully send a string as it's a formdata object
      const { data: response, error } = await api.upload.index
        .post(uploadData)
        .catch((error: any) => {
          console.error("Upload error:", error);
          toast.error("Error", {
            description: "Failed to upload your post. Please try again.",
          });
        });

      toast.success("Success!", {
        description: "Your post has been uploaded successfully",
      });

      router.push(`/`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error", {
        description: "Failed to upload your post. Please try again.",
      });
    }
  };

  const tags = watch("tags");

  useEffect(() => {
    console.log(errors);
    console.log("isSubmitting", isSubmitting);
  }, [errors, isSubmitting]);

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6 space-y-6">
          {/* File Upload Section */}
          <div>
            <Label>Images</Label>
            <div
              {...getRootProps()}
              className={cn(
                "mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} type="file" multiple />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag & drop images here, or click to select files
              </p>
            </div>
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="group relative rounded-lg overflow-hidden p-2 bg-muted"
                  >
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className="mt-1"
                placeholder="Enter post name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="mt-1"
                placeholder="Enter post description"
                rows={4}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label>Categories</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 border rounded-full px-4 py-2 cursor-pointer hover:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    value={category}
                    {...register("categories")}
                    className="hidden"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      watch("categories")?.includes(category)
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {category}
                  </span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm text-destructive mt-1">
                {errors.categories.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="mt-1"
              placeholder="Enter tags (press Enter to add)"
            />
            {errors.tags && (
              <p className="text-sm text-destructive mt-1">
                {errors.tags.message as string}
              </p>
            )}
            {tags && tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Public</Label>
                <p className="text-sm text-muted-foreground">
                  Make this post visible to everyone
                </p>
              </div>
              <Switch {...register("isPublic")} id="public" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nsfw">NSFW</Label>
                <p className="text-sm text-muted-foreground">
                  Mark this post as Not Safe For Work
                </p>
              </div>
              <Switch {...register("isNsfw")} id="nsfw" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai">AI Generated</Label>
                <p className="text-sm text-muted-foreground">
                  Mark if this content was created using AI
                </p>
              </div>
              <Switch {...register("isAiGenerated")} id="ai" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
