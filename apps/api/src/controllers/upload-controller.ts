import { Elysia, t } from "elysia";
import prettyBytes from "pretty-bytes";
import { stat } from "fs/promises";
import mime from "mime";
import { PostModel } from "@workspace/db/src/schema/posts";
import { s3, S3Client } from "bun";
import type { User } from "better-auth";
import { ObjectId } from "mongodb";
import { FileModel } from "@workspace/db/src/schema/files";
import { betterAuth } from "@/middlewares/auth-middleware";
import sharp from "sharp";

type ImagePostBody = {
  name: string;
  description?: string;
  categories: string[];
  tags: string[];
  isPublic: boolean;
  isNsfw: boolean;
  isAiGenerated: boolean;
  files: File[];
};

// Define the schema separately
const imagePostSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),

  categories: t.Union([t.String(), t.Array(t.String())]),
  tags: t.Union([t.String(), t.Array(t.String())]),

  isPublic: t.String({
    pattern: "^(true|false)$",
  }),
  isNsfw: t.String({
    pattern: "^(true|false)$",
  }),
  isAiGenerated: t.String({
    pattern: "^(true|false)$",
  }),
  files: t.Files(),
});

export const r2 = new S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
  secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
  bucket: Bun.env.S3_BUCKET,
  endpoint: Bun.env.S3_ENDPOINT,
});

export const uploadController = new Elysia({ prefix: "/upload" })
  .use(betterAuth)
  .post(
    "/",
    async ({ body, user }: { body: ImagePostBody; user: User }) => {
      const parsedCategories = Array.isArray(body.categories)
        ? body.categories
        : [body.categories];

      const parsedTags = Array.isArray(body.tags) ? body.tags : [body.tags];

      // S3 Key: userId/postId/fileId
      const userId = user.id;
      const postID = new ObjectId();

      let fileIds: string[] = [];

      await Promise.all(
        body.files.map(async (file) => {
          const fileId = new ObjectId();
          const key = `${userId}/${postID}/${fileId}`;

          fileIds.push(fileId.toString());

          // Find width and height
          const image = sharp(await file.arrayBuffer());
          const metadata = await image.metadata();

          const upload = await r2.write(key, file);

          const dbFile = FileModel.create({
            _id: fileId,

            owner: userId,
            post: postID,

            name: file.name,
            mimeType: mime.getType(file.name),

            bytes: upload,

            width: metadata.width,
            height: metadata.height,

            createdAt: new Date(),
            updatedAt: new Date(),
          });
        })
      );

      await PostModel.create({
        _id: postID,
        owner: userId,

        name: body.name,
        description: body.description,

        files: fileIds,

        categories: parsedCategories,
        tags: parsedTags,

        isPublic: body.isPublic,
        isNsfw: body.isNsfw,
        isAiGenerated: body.isAiGenerated,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true };
    },
    {
      body: imagePostSchema,
      auth: true,
    }
  );
