import { connectToDatabase } from "@/utils/db";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import Elysia from "elysia";
import { countingController } from "./controllers/counting-controller";
import { betterAuthView } from "@/utils/auth";
import { imageController } from "./controllers/image-controller";

await connectToDatabase();

const app = new Elysia()
  .use(logger())
  .use(cors())
  .use(
    swagger({
      path: "/",
    })
  )
  .use(countingController)
  .use(imageController)
  .all("/api/auth/*", betterAuthView)
  .listen(3001);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ElysiaApp = typeof app;
