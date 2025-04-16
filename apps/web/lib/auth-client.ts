import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { auth } from "@workspace/api/src/utils/auth";

// @ts-ignore - Disable decleration in tsconfig (maybe)
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});
