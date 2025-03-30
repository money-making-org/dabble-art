import { r2 } from "@/src/controllers/upload-controller";
import { authProtected } from "@/src/middlewares/auth-middleware";
import { UserModel } from "@workspace/db/src/schema/users";
import Elysia, { t } from "elysia";

export const authController = new Elysia({ prefix: "/auth" })
  .use(authProtected) // https://www.better-auth.com/docs/integrations/elysia#macro
  .get("/avatar/:id", async ({ params }) => {
    const key = `avatars/${params.id}`;

    return new Response(r2.file(key));  // Bun s3 client - https://bun.sh/docs/api/s3
  })

  .post(
    "/avatar",
    async ({ body, user }) => {
      const key = `avatars/${user.id}`;
      const url = `https://api.dabble.art/auth/avatar/${user.id}`;

      // Bun s3 client
      await r2.write(key, body.file);

      await UserModel.findByIdAndUpdate(user.id, {
        image: url,
      });

      return {
        success: true,
        url,
      };
    },
    {
      body: t.Object({
        file: t.File({
          maxSize: 1024 * 1024 * 10, // 10MB
        }),
      }),

      authProtected: true, // Will be `auth` by default
    }
  );
