import { r2 } from "@/controllers/upload-controller";
import { FileModel } from "@workspace/db/src/schema/files";
import { PostModel } from "@workspace/db/src/schema/posts";
import Elysia, { t } from "elysia";

export const publicController = new Elysia({ prefix: "/public" })
  .get(
    "/posts",
    async ({ query }) => {
      const { limit = 25, page = 1, search, categories } = query;

      const queryConditions: any = { isPublic: true };

      // Name, desc, tags
      if (search && search.trim()) {
        const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
        if (searchTerms.length > 0) {
          queryConditions.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            {
              tags: {
                $in: searchTerms.map((term: string) => new RegExp(term, "i")),
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

      const posts = await PostModel.find(queryConditions)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate("files");

      return posts;
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        categories: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        limit: t.Optional(
          t.Number({
            default: 25,
          })
        ),
        page: t.Optional(
          t.Number({
            default: 1,
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
