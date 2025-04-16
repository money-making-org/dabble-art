import { r2 } from "@workspace/api/src/controllers/upload-controller";
import { betterAuth } from "@workspace/api/src/middlewares/auth-middleware";
import { FileModel } from "@workspace/db/src/schema/files";
import { FollowingModel } from "@workspace/db/src/schema/followings";
import { LikeModel } from "@workspace/db/src/schema/likes";
import { ElysiaPost, PostModel } from "@workspace/db/src/schema/posts";
import { UserModel } from "@workspace/db/src/schema/users";
import Elysia, { t } from "elysia";
import mongoose from "mongoose";

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
        owner,
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

      let ownerId: string | null = null;
      if (owner) {
        if (mongoose.Types.ObjectId.isValid(owner)) {
          ownerId = owner;
        } else {
          const ownerUser = await UserModel.findOne({ username: owner });
          if (ownerUser) {
            ownerId = ownerUser._id.toString();
          }
        }
      }

      if (ownerId) {
        queryConditions.owner = ownerId;
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
        .populate("owner")
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
        owner: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/posts/:id/files/:fileId/preview",
    async ({ params, error }) => {
      const { fileId } = params;
      const file = await FileModel.findById(fileId);

      if (!file) return error(404, "File not found");

      if (!file.mimeType.startsWith("image/"))
        return error(400, "File is not an image");

      const stream = await r2.file(file.getS3Key()).arrayBuffer();

      return new Response(stream, {
        headers: {
          "Content-Type": file.mimeType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    },
    {
      params: t.Object({
        id: t.String(),
        fileId: t.String(),
      }),
    }
  )
  .get(
    "/posts/:id/files/:fileId/download",
    async ({ params, error }) => {
      const { fileId } = params;
      const file = await FileModel.findById(fileId);

      if (!file) return error(404, "File not found");

      if (!file.mimeType.startsWith("image/"))
        return error(400, "File is not an image");

      return new Response(r2.file(file.getS3Key()));
    },
    {
      params: t.Object({
        id: t.String(),
        fileId: t.String(),
      }),
    }
  )
  .get(
    "/posts/:id",
    async ({ params, user, error }) => {
      const { id } = params;
      const loggedInUserId = user?.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return error(400, "Invalid post ID format.");
      }

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

      let isLiked = false;
      let isFollowing = false;
      let likeCount = 0;

      if (loggedInUserId) {
        try {
          const [likeCheck, followCheck] = await Promise.all([
            LikeModel.exists({ user: loggedInUserId, post: id }).lean(),
            post.owner &&
            typeof post.owner === "object" &&
            post.owner._id &&
            mongoose.Types.ObjectId.isValid(post.owner._id)
              ? FollowingModel.exists({
                  follower: loggedInUserId,
                  following: post.owner._id,
                }).lean()
              : Promise.resolve(null),
          ]);
          isLiked = !!likeCheck;
          isFollowing = !!followCheck;

        } catch (dbError) {
          console.error("Database error checking like/follow status:", dbError);
        }
      }

      try {
        likeCount = await LikeModel.countDocuments({ post: id });
      } catch (dbError) {
        console.error("Database error getting like count:", dbError);
        likeCount = 0;
      }

      await PostModel.findByIdAndUpdate(id, {
        $inc: { "analytics.views": 1 },
      }).catch((err: Error) =>
        console.error("Failed to increment post views:", err)
      );

      post.owner.isFollowing = isFollowing;
      post.isLiked = isLiked;
      post.likeCount = likeCount;
      post.commentsCount = post.commentsCount ?? 0;
      post.analytics = post.analytics ?? { views: 0, likesCount: 0 };

      return post;
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
      // response: ElysiaPost
    }
  )
  .post(
    "/posts/:id/like",
    async ({ params, user, error }) => {
      if (!user?.id) {
        return (error as any)(401, "Authentication required to like posts.");
      }
      const userId = user.id;
      const postId = params.id;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return error(400, "Invalid post ID format.");
      }

      const postExists = await PostModel.exists({ _id: postId });
      if (!postExists) {
        return error(404, "Post not found.");
      }

      let isLiked: boolean;
      let likeCount: number;

      try {
        const existingLike = await LikeModel.findOne({
          user: userId,
          post: postId,
        });

        if (existingLike) {
          await LikeModel.deleteOne({ _id: existingLike._id });
          isLiked = false;
        } else {
          try {
            await LikeModel.create({ user: userId, post: postId });
            isLiked = true;
          } catch (createError: any) {
            if (createError.code === 11000) {
              console.warn(
                `Race condition detected: Like already exists for user ${userId} post ${postId}. Treating as liked.`
              );
              const raceCheck = await LikeModel.exists({
                user: userId,
                post: postId,
              });
              isLiked = !!raceCheck;
            } else {
              throw createError;
            }
          }
        }

        likeCount = await LikeModel.countDocuments({ post: postId });
      } catch (dbError) {
        console.error("Database error during like/unlike operation:", dbError);
        return error(500, "An error occurred while processing your request.");
      }

      return { success: true, isLiked, likeCount };
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        summary: "Like or unlike a post",
        tags: ["Posts", "Social"],
      },
      auth: true,
    }
  )
  .delete(
    "/posts/:id",
    async ({ params, user, error }) => {
      if (!user?.id) {
        return error(401, "Authentication required to delete posts.");
      }
      const userId = user.id;
      const postId = params.id;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return error(400, "Invalid post ID format.");
      }

      // 2. Authorization & Fetch Post with Files Populated
      // We need the file details, so populate 'files' here
      const post = await PostModel.findOne({ _id: postId }).populate("files");

      if (!post) {
        return error(404, "Post not found.");
      }

      if (post.owner.toString() !== userId) {
        return error(403, "You do not have permission to delete this post.");
      }

      // 3. Deletion Logic
      try {
        // --- Delete associated files from R2 ---
        if (post.files && post.files.length > 0) {
          const fileDeletionPromises = post.files.map(async (file: any) => {
            // Assuming FileModel instances have getS3Key() or similar
            // And assuming the r2 client has a delete method
            const fileKey = file.getS3Key(); // Adapt if key retrieval is different
            if (fileKey) {
              console.log(`Attempting to delete file from R2: ${fileKey}`);
              return r2.delete(fileKey);
            } else {
              console.warn(`Could not get S3 key for file ID: ${file._id}`);
              return Promise.resolve({ status: "skipped", reason: "No key" }); // Indicate skipped file
            }
          });
        }
        // --- End R2 Deletion ---

        // Delete associated likes
        await LikeModel.deleteMany({ post: postId });

        // Delete associated comments (if applicable)
        // await CommentModel.deleteMany({ post: postId });

        // Delete the File documents associated with the post from DB
        await FileModel.deleteMany({
          _id: { $in: post.files.map((f: any) => f._id) },
        });

        // Delete the post itself from DB
        await PostModel.deleteOne({ _id: postId });

        return {
          success: true,
          message: "Post and associated data deleted successfully.",
        };
      } catch (err: any) {
        // Catch any error (DB or potentially R2 if not caught earlier)
        console.error(
          `Error during post deletion process for ID ${postId}:`,
          err
        );
        return error(
          500,
          err.message || "An error occurred while deleting the post."
        );
      }
    },
    {
      params: t.Object({ id: t.String() }),
      detail: {
        summary: "Delete a post by ID",
        tags: ["Posts"],
      },
      auth: true,
    }
  );
