import { r2 } from "@/controllers/upload-controller";
import { FileModel } from "@workspace/db/src/schema/files";
import { PostModel } from "@workspace/db/src/schema/posts";
import Elysia, { t } from "elysia";

export const publicController = new Elysia({ prefix: "/public" })
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
  });
