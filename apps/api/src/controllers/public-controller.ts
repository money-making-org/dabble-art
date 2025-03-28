import { r2 } from "@/controllers/upload-controller";
import { FileModel } from "@workspace/db/src/schema/files";
import { PostModel } from "@workspace/db/src/schema/posts";
import Elysia, { t } from "elysia";

export const publicController = new Elysia({ prefix: "/public" })
  .get(
    "/posts",
    async ({ query }) => {
      const { limit = 25, page = 1, search } = query;

      const posts = await PostModel.find({ isPublic: true })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("files");

      console.log("Posts", posts);

      return posts;
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),

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
