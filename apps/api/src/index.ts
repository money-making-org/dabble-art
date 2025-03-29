import { connectToDatabase } from "@/utils/db";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import Elysia from "elysia";
import { uploadController } from "./controllers/upload-controller";
import { publicController } from "./controllers/public-controller";
import { betterAuth } from "@/middlewares/auth-middleware";
import { auth } from "@/utils/auth";
import { userController } from "./controllers/user-controller";

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
  .use(publicController)
  .use(userController)
  .use(uploadController)
  .listen(3001);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);

export type ElysiaApp = typeof app;
