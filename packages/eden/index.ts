import { treaty } from "@elysiajs/eden";
import type { ElysiaApp } from "@workspace/api/src/index";

export const api = treaty<ElysiaApp>(process.env.NEXT_PUBLIC_API_URL!, {
  fetch: {
    credentials: "include",
  },
});
