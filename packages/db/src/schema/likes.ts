import { database } from "@/database";
import { t, type Static } from "elysia";
import mongoose, { Schema, type Document } from "mongoose";

export const ElysiaLike = t.Object({
  _id: t.Any(),
  user: t.String(),
  post: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

type LikeType = Static<typeof ElysiaLike>;

export interface Like extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LikeSchema = new Schema<Like>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true }, // Ensure 'user' ref matches your User model name
    post: { type: Schema.Types.ObjectId, ref: "posts", required: true }, // Ensure 'posts' ref matches your Post model name
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const LikeModel = database.model<Like>("likes", LikeSchema);
