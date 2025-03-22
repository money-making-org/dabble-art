import Elysia from "elysia";

let count = 0;

export const countingController = new Elysia({ prefix: "/counting" })
  .get("/", () => count)
  .post("/", () => {
    count++;
    return { count };
  });
