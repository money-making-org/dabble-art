import { database } from "@/database";
import { ElysiaFile, type FileType } from "@/schema/files";
import { ElysiaUser } from "@/schema/users";
import { t, type Static } from "elysia";
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
    downloads: t.Optional(t.Number()),
  }),

  updatedAt: t.Date(),
  createdAt: t.Date(),
});

export type PostType = Static<typeof ElysiaPost>;

export interface PopulatedPost
  extends Omit<PostType, "files" | "analytics">,
    Document {
  files: FileType[];
  analytics: {
    views?: number;
    downloads?: number;
  };
  updatedAt: Date;
  createdAt: Date;
}

interface Post extends Omit<PostType, "analytics">, Document {
  analytics: {
    views?: number;
    downloads?: number;
  };
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
      type: {
        views: Number,
        downloads: Number,
      },
      default: {
        views: 0,
        downloads: 0,
      },
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
