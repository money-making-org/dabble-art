import Elysia, { t } from "elysia";

let count = 0;

export const countingController = new Elysia({ prefix: "/counting" })
  .get("/", (ctx) => {
    return { count };
  })
  .post(
    "/",
    (ctx) => {
      const { multipler } = ctx.body;

      count += multipler;
      return { count };
    },
    {
      body: t.Object({
        multipler: t.Number(),
      }),
    }
  );
