import { Elysia, t } from "elysia";
import prettyBytes from "pretty-bytes";
import { stat } from "fs/promises";
import mime from "mime";
import { PostModel } from "@workspace/db/src/schema/posts";
import { s3, S3Client } from "bun";
import type { User } from "better-auth";
import { ObjectId } from "mongodb";
import { FileModel } from "@workspace/db/src/schema/files";
import { authProtected } from "@workspace/api/src/middlewares/auth-middleware";
import sharp from "sharp";
import mongoose from "mongoose";
import { sendNewArtAlert } from "@/src/utils/alerts";

export const GB = 1000 * 1000 * 1000;
export const ACCOUNT_STORAGE_LIMIT = 2 * GB;

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
  .use(authProtected)
  .post(
    "/",
    async ({ body, user }: { body: ImagePostBody; user: User }) => {
      const parsedCategories = Array.isArray(body.categories)
        ? body.categories
        : [body.categories];

      console.log("User", user);

      const parsedTags = Array.isArray(body.tags) ? body.tags : [body.tags];

      // Calculate the total file size of the current upload request
      const newUploadSize = await Promise.all(
        body.files.map(async (file) => (await file.arrayBuffer()).byteLength)
      ).then((sizes) => sizes.reduce((total, size) => total + size, 0));

      try {
        // Calculate current storage used by querying the database
        const storageResults = await FileModel.aggregate([
          {
            $match: {
              owner: new mongoose.Types.ObjectId(user.id),
            },
          },
          {
            $group: {
              _id: null,
              totalSize: { $sum: "$bytes" },
            },
          },
        ]);

        // If no files exist yet, storageResults will be an empty array
        const totalStorageUsed =
          storageResults.length > 0 ? storageResults[0].totalSize : 0;

        // Calculate total storage including the new upload
        const projectedStorage = totalStorageUsed + newUploadSize;

        console.log(`Current storage: ${prettyBytes(totalStorageUsed)}`);
        console.log(`New upload size: ${prettyBytes(newUploadSize)}`);
        console.log(
          `Projected storage: ${prettyBytes(projectedStorage)} / ${prettyBytes(ACCOUNT_STORAGE_LIMIT)}`
        );

        // Check if the new upload would exceed the storage limit
        if (projectedStorage > ACCOUNT_STORAGE_LIMIT) {
          return {
            error: "Account storage limit reached",
            currentUsage: prettyBytes(totalStorageUsed),
            limit: prettyBytes(ACCOUNT_STORAGE_LIMIT),
            remaining: prettyBytes(
              Math.max(0, ACCOUNT_STORAGE_LIMIT - totalStorageUsed)
            ),
          };
        }

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

        setTimeout(() => {
          sendNewArtAlert({
            authorId: user.id,
            authorName: user.name ? `${user.name} (${user.email})` : user.email,
            name: body.name,
            postId: postID.toString(),
            primaryFileId: fileIds[0] ?? "",
            postStorageUsed: newUploadSize,
            totalStorageUsed: projectedStorage,
          });
        }, 0);

        return { success: true };
      } catch (err) {
        console.error("Error processing upload:", err);
        return { error: "Failed to process upload", details: err.message };
      }
    },
    {
      body: imagePostSchema,
      auth: true,
    }
  );
