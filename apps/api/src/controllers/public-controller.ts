import { r2 } from "@/controllers/upload-controller";
import { FileModel } from "@workspace/db/src/schema/files";
import { FollowingModel } from "@workspace/db/src/schema/followings";
import { PostModel } from "@workspace/db/src/schema/posts";
import { betterAuth } from "@/middlewares/auth-middleware";
import Elysia, { t } from "elysia";

export const publicController = new Elysia({ prefix: "/public" })
  .use(betterAuth)
  .get(
    "/posts",
    async ({ query }) => {
      const {
        limit = 25,
        page = 1,
        search,
        categories,
        sort = "latest",
        excludeIds,
      } = query;

      const queryConditions: any = { isPublic: true };

      // Exclude specific IDs if provided
      if (excludeIds && excludeIds.length > 0) {
        queryConditions._id = { $nin: excludeIds };
      }

      // Name, desc, tags
      if (search && search.trim()) {
        const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
        if (searchTerms.length > 0) {
          // Use regex search for partial matches
          queryConditions.$or = [
            // Regex search for partial matches in name
            {
              name: {
                $regex: searchTerms.map((term) => `(?i)${term}`).join("|"),
              },
            },
            // Regex search for partial matches in description
            {
              description: {
                $regex: searchTerms.map((term) => `(?i)${term}`).join("|"),
              },
            },
            // Regex search for partial matches in tags
            {
              tags: {
                $in: searchTerms.map((term) => new RegExp(term, "i")),
              },
            },
          ];
        }
      }

      // Categories
      if (
        categories &&
        (Array.isArray(categories)
          ? categories.length > 0
          : categories !== "undefined")
      ) {
        queryConditions.categories = {
          $in: Array.isArray(categories) ? categories : [categories],
        };
      }

      // Determine sort order
      let sortOrder: any = { createdAt: -1 };

      switch (sort) {
        case "popular":
          // For now, just sort by date since we don't have popularity metrics
          sortOrder = { createdAt: 1 };
          break;
        case "latest":
          sortOrder = { createdAt: -1 };
          break;
        // For relevance, we'll keep the default createdAt sort since we can't
        // combine text score with regex search
        default:
          break;
      }

      const posts = await PostModel.find(queryConditions)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortOrder)
        .populate("files")
        .lean();
      return posts;
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        categories: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        sort: t.Optional(
          t.Union([
            t.Literal("latest"),
            t.Literal("popular"),
            t.Literal("relevance"),
          ])
        ),
        limit: t.Optional(
          t.Number({
            default: 25,
            maximum: 75,
            minimum: 1,
          })
        ),
        page: t.Optional(
          t.Number({
            default: 1,
            minimum: 1,
          })
        ),
        excludeIds: t.Optional(t.Array(t.String())),
      }),
    }
  )
  .get(
    "/posts/:id/files/:fileId/preview",
    async ({ params, error }) => {
      const { fileId } = params;
      const file = await FileModel.findById(fileId).lean();
      if (!file) return error(404, "File not found");
      if (!file.mimeType.startsWith("image/"))
        return error(400, "File is not an image");
      // Assuming r2.file returns a stream or compatible response body
      return new Response(r2.file(file.getS3Key()));
    },
    {
      params: t.Object({ id: t.String(), fileId: t.String() }),
    }
  )
  .get(
    "/posts/:id",
    async ({ params, user, error }) => {
      const { id } = params;
      const loggedInUserId = user?.id;

      const post = await PostModel.findOne({
        _id: id,
        isPublic: true,
      })
        .populate("files")
        .populate("owner")
        .lean();
      if (!post) {
        return error(404, "Post not found");
      }

      const postObject = { ...post };

      postObject.analytics = postObject.analytics || {};
      postObject.analytics.likesCount = postObject.analytics.likes?.length ?? 0;

      let isFollowing = false;
      if (loggedInUserId && postObject.owner) {
        const followingOwnerId =
          typeof postObject.owner === "object"
            ? postObject.owner._id
            : postObject.owner;
        if (followingOwnerId) {
          const followCheck = await FollowingModel.findOne({
            follower: loggedInUserId,
            following: followingOwnerId,
          }).lean();
          isFollowing = !!followCheck;
        }
      }

      if (postObject.owner) {
        const ownerData =
          typeof postObject.owner === "object"
            ? postObject.owner
            : { _id: postObject.owner };
        postObject.owner = {
          ...ownerData,
          isFollowing,
        };
      }

      PostModel.findByIdAndUpdate(id, {
        $inc: { "analytics.views": 1 },
      }).exec();

      return postObject;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get a single public post by ID",
        tags: ["Posts"],
      },
      auth: true,
    }
  )
  .post(
    "/posts/:id/like",
    async ({ params, user, error }) => {
      if (!user?.id) {
        return error(401, "Authentication required to like posts.");
      }
      const userId = user.id;

      const { id } = params;
      const post = await PostModel.findById(id);
      if (!post) return error(404, "Post not found");

      let updatedPost;
      if (post.analytics?.likes?.includes(userId)) {
        updatedPost = await PostModel.findByIdAndUpdate(
          id,
          { $pull: { "analytics.likes": userId } },
          { new: true }
        );
      } else {
        updatedPost = await PostModel.findByIdAndUpdate(
          id,
          { $addToSet: { "analytics.likes": userId } },
          { new: true }
        );
      }
      return updatedPost?.toObject() ?? post.toObject();
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        summary: "Like or unlike a post",
        tags: ["Posts", "Social"],
      },
      auth: true,
    }
  );
