import { authProtected } from "@workspace/api/src/middlewares/auth-middleware";
import { FollowingModel } from "@workspace/db/src/schema/followings";
import { UserModel } from "@workspace/db/src/schema/users";
import Elysia, { t } from "elysia";
import mongoose from "mongoose";

export const userController = new Elysia({ prefix: "/users" })
  .use(authProtected)
  .get(
    "/:userId",
    async ({ params, error }) => {
      const { userId } = params;

      let query: any = {};

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        query = { username: userId };
      } else {
        query = { _id: userId };
      }

      const user = await UserModel.findOne(query);
      if (!user) {
        return error(404, "User not found.");
      }

      return {
        name: user.name,
        username: user.username,
        displayUsername: user.displayUsername,

        image: user.image,
        bio: user.bio,
      };
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
    }
  )
  .post(
    "/:userId/follow",
    async ({ params, user, error }) => {
      const followerId = user.id;
      const followingId = params.userId;

      if (followerId === followingId) {
        return error(400, "Cannot follow yourself.");
      }

      // Validate if followingId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(followingId)) {
        return error(400, "Invalid user ID format.");
      }

      // Check if relationship already exists
      const existing = await FollowingModel.findOne({
        follower: followerId,
        following: followingId,
      });

      if (existing) {
        return error(409, "Already following this user.");
      }

      // Create the follow relationship
      await FollowingModel.create({
        follower: followerId,
        following: followingId,
      });

      // TODO: Optionally increment follower count on User model if denormalizing

      return { success: true, message: "User followed successfully." };
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
      detail: {
        summary: "Follow a user",
        tags: ["Users", "Social"],
      },
      authProtected: true,
    }
  )
  .delete(
    "/:userId/follow",
    async ({ params, user, error }) => {
      const followerId = user.id;
      const followingId = params.userId;

      if (followerId === followingId) {
        // Technically allowed, but might indicate an issue elsewhere
        return error(400, "Cannot unfollow yourself.");
      }

      // Validate if followingId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(followingId)) {
        return error(400, "Invalid user ID format.");
      }

      // Attempt to delete the follow relationship
      const result = await FollowingModel.deleteOne({
        follower: followerId,
        following: followingId,
      });

      if (result.deletedCount === 0) {
        return error(404, "Not following this user.");
      }

      // TODO: Optionally decrement follower count on User model if denormalizing

      return { success: true, message: "User unfollowed successfully." };
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
      detail: {
        summary: "Unfollow a user",
        tags: ["Users", "Social"],
      },
      authProtected: true,
    }
  );
