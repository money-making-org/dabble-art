import { auth } from "@/utils/auth";
import type { Session, User } from "better-auth/types";
import type { Context } from "elysia";
import Elysia from "elysia";

export const betterAuth = new Elysia({ name: "better-auth" })
  .macro({
    auth: {
      async resolve({ error, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

export const authProtected = new Elysia({ name: "auth-protected" })
  .use(betterAuth)
  .macro({
    authProtected: {
      async resolve({ error, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return error(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
