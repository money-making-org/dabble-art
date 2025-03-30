import { r2 } from "@/src/controllers/upload-controller";
import { authProtected } from "@/src/middlewares/auth-middleware";
import { UserModel } from "@workspace/db/src/schema/users";
import Elysia, { t } from "elysia";

export const authController = new Elysia({ prefix: "/auth" })
  .use(authProtected)
  .get("/avatar/:id", async ({ params }) => {
    const key = `avatars/${params.id}`;

    return new Response(r2.file(key));
  })

  .post(
    "/avatar",
    async ({ body, user }) => {
      const key = `avatars/${user.id}`;

      await r2.write(key, body.image);

      await UserModel.findByIdAndUpdate(user.id, {
        image: `https://api.dabble.art/auth/avatar/${user.id}`,
      });

      return {
        success: true,
        url: `https://api.dabble.art/auth/avatar/${user.id}`,
      };
    },
    {
      body: t.Object({
        image: t.File({
          maxSize: 1024 * 1024 * 10, // 10MB
        }),
      }),

      authProtected: true,
    }
  );
