import { connectToDatabase } from "@/utils/db";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import Elysia from "elysia";
import { countingController } from "./controllers/counting-controller";
import { imageController } from "./controllers/image-controller";
import { betterAuth } from "@/middlewares/auth-middleware";

await connectToDatabase();

const app = new Elysia()
  .use(logger())
  .use(cors())
  .use(
    swagger({
      path: "/",
    })
  )
  .onError(({ error, code, path }) => {
    console.error(error);
  })
  .use(betterAuth)
  .use(imageController)
  .listen(3001);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ElysiaApp = typeof app;
