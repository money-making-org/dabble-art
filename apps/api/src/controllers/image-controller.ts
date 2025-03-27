import { Elysia, t } from "elysia";
import prettyBytes from "pretty-bytes";
import { stat } from "fs/promises";
import mime from "mime";
import { PostModel } from "@workspace/db/src/schema/posts";
import { s3, S3Client } from "bun";

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

const r2 = new S3Client({
  accessKeyId: Bun.env.S3_ACCESS_KEY_ID,
  secretAccessKey: Bun.env.S3_SECRET_ACCESS_KEY,
  bucket: Bun.env.S3_BUCKET,
  endpoint: Bun.env.S3_ENDPOINT,
});

export const imageController = new Elysia({ prefix: "/post" }).post(
  "/",
  async ({ body }: { body: ImagePostBody }) => {
    const parsedCategories = Array.isArray(body.categories)
      ? body.categories
      : [body.categories];

    const parsedTags = Array.isArray(body.tags) ? body.tags : [body.tags];

    console.log("\n=== Image Upload Details ===\n");
    console.log(body);

    // Basic Information
    console.log("📝 Basic Information:");
    console.log(`  Name: ${body.name}`);
    console.log(
      `  Description: ${body.description || "No description provided"}`
    );

    // Categories and Tags
    console.log("\n🏷️ Categories:");
    parsedCategories.forEach((cat) => console.log(`  • ${cat}`));

    console.log("\n🔖 Tags:");
    parsedTags.forEach((tag) => console.log(`  • ${tag}`));

    // Flags
    console.log("\n⚙️ Settings:");
    console.log(`  • Public: ${body.isPublic ? "Yes" : "No"}`);
    console.log(`  • NSFW: ${body.isNsfw ? "Yes" : "No"}`);
    console.log(`  • AI Generated: ${body.isAiGenerated ? "Yes" : "No"}`);

    // Files

    console.log("\n📁 Files:");
    await Promise.all(
      body.files.map(async (file, index) => {
        console.log(`\n  File ${index + 1}:`);
        console.log(`    Name: ${file.name}`);
        console.log(
          `    Size: ${prettyBytes(
            await file.bytes().then((bytes) => bytes.length)
          )}`
        );
        console.log(`    Type: ${mime.getType(file.name)}`);
      })
    );

    console.log("\n==========================\n");

    // Create model and upload to s3, then update the model s3Key property
    // const post = await PostModel.create({

    // });

    console.log("Uploading files to s3...");
    for (const file of body.files) {
      console.log(`Uploading ${file.name}...`);
      await r2.write(file.name, file).catch((err) => {
        console.error(`Error uploading ${file.name}:`, err);
      });
    }

    return { success: true };
  },
  {
    body: imagePostSchema,
  }
);
