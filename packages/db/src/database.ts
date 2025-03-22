import mongoose from "mongoose";
import Bun from "bun";

mongoose.connect(Bun.env.DATABASE_URL!, {
  dbName: Bun.env.DATABASE_NAME!,
});

export const database = mongoose.connection;

database.once("open", () => {
  console.log("[MongoDB]: Successfully connected");
});

database.on("error", (error) => console.error(`[MongoDB] Error: ${error}`));
