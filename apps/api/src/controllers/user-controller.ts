import {
  authProtected,
  betterAuth,
} from "@workspace/api/src/middlewares/auth-middleware";
import { FollowingModel } from "@workspace/db/src/schema/followings";
import { UserModel } from "@workspace/db/src/schema/users";
import Elysia, { t } from "elysia";
import mongoose from "mongoose";

export const userController = new Elysia({ prefix: "/users" })
  .use(betterAuth)
  .get(
    "/:userId",
    async ({ params, error, user }) => {
      const { userId } = params;

      let query: any = {};

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        query = { username: userId };
      } else {
        query = { _id: userId };
      }

      const queriedUser = await UserModel.findOne(query);
      if (!queriedUser) {
        return error(404, "User not found.");
      }

      const queriedUserId = queriedUser._id

      let isFollowing = false;

      let followers = 0
      let following = 0

      await FollowingModel.find({
          $or: [
              { follower: queriedUserId },
              { following: queriedUserId }
          ]
      }).lean().then(docs => {
          docs.forEach(doc => {
              if (doc.following.equals(queriedUserId)) followers += 1
              if (doc.follower.equals(queriedUserId)) following += 1
          })
      })

      console.log(user);
      if (user) {
        const following = await FollowingModel.exists({
          follower: user.id,
          following: queriedUser._id,
        }).lean();

        console.log(following);

        isFollowing = !!following;
      }

      const stats = { following, followers }

      return {
        id: queriedUser._id,

        name: queriedUser.name,
        username: queriedUser.username,
        displayUsername: queriedUser.displayUsername,

        image: queriedUser.image,
        bio: queriedUser.bio,

        stats: stats,
        isFollowing: isFollowing,
      };
    },
    {
      params: t.Object({
        userId: t.String(),
      }),

      auth: true,
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
