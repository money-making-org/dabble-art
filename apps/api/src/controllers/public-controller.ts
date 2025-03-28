import { r2 } from "@/controllers/upload-controller";
import { FileModel } from "@workspace/db/src/schema/files";
import { ElysiaPost, PostModel } from "@workspace/db/src/schema/posts";
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
      } = query;

      const queryConditions: any = { isPublic: true };

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
      }),
    }
  )
  .get("/posts/:id/files/:fileId/preview", async ({ params }) => {
    const { id, fileId } = params;

    const file = await FileModel.findById(fileId);

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    // is it an image?
    if (!file.mimeType.startsWith("image/")) {
      return new Response("File is not an image", { status: 400 });
    }

    return new Response(r2.file(file.getS3Key()));
  })
  .get(
    "/posts/:id",
    async ({ params }) => {
      const { id } = params;

      const post = await PostModel.findOne({
        _id: id,
        isPublic: true,
      })
        .populate("files")
        .populate("owner")
        .lean();
      if (!post) {
        return new Response("Post not found", { status: 404 });
      }

      // increment views
      const updatedPost = await PostModel.findByIdAndUpdate(id, {
        $inc: { "analytics.views": 1 },
      });

      if (post.analytics && post.analytics.likes) {
        post.analytics.likesCount = post.analytics.likes.length;
      }
      
      return post;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/posts/:id/like",
    async ({ params, user }) => {
      const { id } = params;

      const post = await PostModel.findById(id);

      if (!post) {
        return new Response("Post not found", { status: 404 });
      }

      let newPost = post;

      if (post.analytics.likes.includes(user.id)) {
        newPost = await PostModel.findByIdAndUpdate(id, {
          $pull: { "analytics.likes": user.id },
        });
      } else {
        newPost = await PostModel.findByIdAndUpdate(id, {
          $push: { "analytics.likes": user.id },
        });
      }

      return newPost.toObject();
    },
    {
      auth: true,
    }
  );
