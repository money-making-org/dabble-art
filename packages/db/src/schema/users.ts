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
  email: t.String(),
  emailVerified: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

interface User extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "user" }
);

export const UserModel = model<User>("user", UserSchema);
