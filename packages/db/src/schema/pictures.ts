import { database } from "@/database";
import mongoose, { type Document, Schema } from "mongoose";
import { z } from "zod";

export interface Picture extends Document {
  owner: any; // User object

  name: string;
  description: string;
  image: string;

  createdAt: Date;
  updatedAt: Date;
}

const PictureSchema = new Schema<Picture>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export const PictureModel = database.model<Picture>("pictures", PictureSchema);

export const ZodPicture = z.object({
  id: z.string(),

  owner: z.instanceof(mongoose.Types.ObjectId),
  name: z.string(),
  description: z.string(),
  image: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PictureType = z.infer<typeof ZodPicture>;
