import { connectToDatabase } from "@workspace/api/src/utils/db";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import Elysia from "elysia";
import { uploadController } from "@workspace/api/src/controllers/upload-controller";
import { publicController } from "@workspace/api/src/controllers/public-controller";
import { betterAuth } from "@workspace/api/src/middlewares/auth-middleware";
import { auth } from "@workspace/api/src/utils/auth";
import { userController } from "@workspace/api/src/controllers/user-controller";
import { authController } from "@/src/controllers/auth-controller";

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
  .mount(auth.handler)
  .use(authController)
  .use(publicController)
  .use(userController)
  .use(uploadController)
  .listen(3001);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ElysiaApp = typeof app;
