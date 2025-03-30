import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

// @ts-ignore - Disable decleration in tsconfig (maybe)
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [usernameClient()],
});
