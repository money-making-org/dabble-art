import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { openAPI, username } from "better-auth/plugins";
import type { Context } from "elysia";
import { MongoClient } from "mongodb";

const client = new MongoClient(Bun.env.DATABASE_URL!);
const db = client.db(Bun.env.DATABASE_NAME!);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000", "https://dabble.art"],

  plugins: [username(), openAPI(), nextCookies()],
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
    },
  },

  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".dabble.art"
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",  // Allows CORS-based cookie sharing across subdomains
      partitioned: true, // New browser standards will mandate this for foreign cookies
  },
  }
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405);
  }
};
