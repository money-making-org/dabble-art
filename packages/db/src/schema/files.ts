import { database } from "@/database";
import { t } from "elysia";
import mongoose, { type Document, Schema } from "mongoose";
import { z } from "zod";

export interface File extends Document {
  owner: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;

  name: string;
  mimeType: string;

  bytes: number; // Size in bytes
  s3Key: string;

  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<File>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    post: { type: Schema.Types.ObjectId, ref: "posts", required: true },

    name: { type: String, required: true },
    mimeType: { type: String, required: true },

    bytes: { type: Number, required: true },
    s3Key: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export const FileModel = database.model<File>("files", FileSchema);

export const ZodFile = z.object({
  id: z.string(),

  owner: z.instanceof(mongoose.Types.ObjectId),
  post: z.instanceof(mongoose.Types.ObjectId),

  name: z.string(),
  mimeType: z.string(),

  bytes: z.number(),
  s3Key: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FileType = z.infer<typeof ZodFile>;
