import { connectToDatabase } from "@/util/db";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@tqman/nice-logger";
import Elysia from "elysia";
import { countingController } from "./controllers/counting-controller";

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
  .listen(3001);

console.log("API server is running on http://localhost:3001");

export type ElysiaApp = typeof app;
