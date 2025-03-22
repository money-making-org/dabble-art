import { treaty } from "@elysiajs/eden";
import type { ElysiaApp } from "@workspace/api/index";

export const api = treaty<ElysiaApp>("localhost:3001");
