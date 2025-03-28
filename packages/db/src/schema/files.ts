import { database } from "@/database";
import { ElysiaUser } from "@/schema/users";
import { ElysiaPost } from "@/schema/posts";
import { t } from "elysia";
import mongoose, { type Document, Schema } from "mongoose";
import { z } from "zod";

export interface File extends Document {
  owner: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;

  name: string;
  mimeType: string;

  bytes: number; // Size in bytes

  width: number;
  height: number;

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

    width: { type: Number, required: true },
    height: { type: Number, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,

    methods: {
      getS3Key() {
        return `${this.owner}/${this.post}/${this._id}`;
      },
    },
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

  width: z.number(),
  height: z.number(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FileType = z.infer<typeof ZodFile>;

export const ElysiaFile = t.Object({
  _id: t.Any(),
  owner: ElysiaUser,
  post: ElysiaPost,
  name: t.String(),
  mimeType: t.String(),
  bytes: t.Number(),
  width: t.Number(),
  height: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});