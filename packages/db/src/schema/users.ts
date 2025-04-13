/*
{
  "_id": {
    "$oid": "67e6bedb0a68cc2792e76c10"
  },
  "name": "Dawson",
  "email": "hello@dawson.gg",
  "emailVerified": false,
  "createdAt": {
    "$date": "2025-03-28T15:23:07.012Z"
  },
  "updatedAt": {
    "$date": "2025-03-28T15:23:07.012Z"
  }
}
*/

import { t } from "elysia";
import { model, Schema } from "mongoose";

export const ElysiaUser = t.Object({
  _id: t.Any(),
  name: t.String(),
  username: t.String(),
  email: t.String(),
  emailVerified: t.Boolean(),
  image: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

interface User extends Document {
  name: string;
  username: string;
  displayUsername: string;
  email: string;
  emailVerified: boolean;
  image: string;
  bio: string;
  updatedAt: Date;
  createdAt: Date;
}

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    displayUsername: { type: String },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true, collection: "user" }
);

export const UserModel = model<User>("user", UserSchema);
