import { database } from "@/database";
import { ElysiaFile, type FileType } from "@/schema/files";
import { ElysiaUser } from "@/schema/users";
import { t } from "elysia";
import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const ElysiaPost = t.Object({
  _id: t.Any(),
  owner: ElysiaUser,

  name: t.String(),
  description: t.Optional(t.String()),

  categories: t.Array(t.String()),
  tags: t.Array(t.String()),

  files: t.Array(ElysiaFile),

  isPublic: t.Boolean(),
  isNsfw: t.Boolean(),
  isAiGenerated: t.Boolean(),

  analytics: t.Object({
    views: t.Number(),
    likes: t.Array(t.String()),
    downloads: t.Number(),
  }),

  updatedAt: t.Date(),
  createdAt: t.Date(),
});

export const ZodPost = z.object({
  _id: z.string(),
  owner: z.instanceof(mongoose.Schema.Types.ObjectId),

  name: z.string(),
  description: z.string().nullable(),

  categories: z.array(
    z.enum([
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
    ])
  ),
  tags: z.array(z.string().min(2).max(20)).max(10),

  files: z.array(z.instanceof(mongoose.Schema.Types.ObjectId)),

  isPublic: z.boolean(),
  isNsfw: z.boolean(),
  isAiGenerated: z.boolean(),

  analytics: z.object({
    views: z.number().default(0),
    likes: z.array(z.string()).default([]),
    downloads: z.number().default(0),
  }),

  updatedAt: z.date(),
  createdAt: z.date(),
});

export type PostType = z.infer<typeof ZodPost>;

export interface PopulatedPost extends Omit<PostType, "files">, Document {
  files: FileType[];
  updatedAt: Date;
  createdAt: Date;
}

interface Post extends PostType, Document {
  updatedAt: Date;
  createdAt: Date;
}

const PostSchema = new Schema<Post>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    name: { type: String, required: true },
    description: { type: String, required: false },

    files: [{ type: Schema.Types.ObjectId, ref: "files", default: [] }],

    categories: {
      type: [String],
      enum: [
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
      ],
      default: [],
    },
    tags: { type: [String], default: [] },

    isPublic: { type: Boolean, default: true },
    isNsfw: { type: Boolean, default: false },
    isAiGenerated: { type: Boolean, default: false },

    analytics: {
      views: { type: Number, default: 0 },
      likes: { type: [String], default: [] },
      downloads: { type: Number, default: 0 },
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

// Add text index for name and description only
PostSchema.index({
  name: "text",
  description: "text",
});

export const PostModel = database.model<Post>("posts", PostSchema);
