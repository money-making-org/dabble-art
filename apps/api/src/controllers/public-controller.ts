import { r2 } from "@/controllers/upload-controller";
import { FileModel } from "@workspace/db/src/schema/files";
import { PostModel } from "@workspace/db/src/schema/posts";
import Elysia from "elysia";

export const publicController = new Elysia({ prefix: "/public" })
  .get("/posts", async ({}) => {
    const posts = await PostModel.find({ isPublic: true })
      .limit(10)
      .populate("files");

    return posts;
  })
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
