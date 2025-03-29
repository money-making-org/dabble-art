import { database } from "@/database";
import { ElysiaUser } from "@/schema/users";
import { t, type Static } from "elysia";
import mongoose, { Schema, type Document } from "mongoose";

export const ElysiaFollowing = t.Object({
  _id: t.Any(),

  follower: ElysiaUser,
  following: ElysiaUser,

  createdAt: t.Date(),
  updatedAt: t.Date(),
});

type FollowingType = Static<typeof ElysiaFollowing>;

export interface Following extends Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const FollowingSchema = new Schema<Following>(
  {
    follower: { type: Schema.Types.ObjectId, ref: "user", required: true },
    following: { type: Schema.Types.ObjectId, ref: "user", required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const FollowingModel = database.model<Following>(
  "followings",
  FollowingSchema
);
