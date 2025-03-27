import mongoose from "mongoose";

// Ensure connection happens only once
let isConnected = false;

/**
 * Initialize the database connection for the API
 */
export async function connectToDatabase() {
  if (isConnected) {
    console.log("[MongoDB]: Already connected");
    return;
  }

  try {
    const DATABASE_URL = Bun.env.DATABASE_URL;
    const DATABASE_NAME = Bun.env.DATABASE_NAME;

    if (!DATABASE_URL || !DATABASE_NAME) {
      throw new Error(
        "DATABASE_URL or DATABASE_NAME environment variables not set",
      );
    }

    await mongoose.connect(DATABASE_URL, {
      dbName: DATABASE_NAME,
    });

    isConnected = true;
    console.log("[MongoDB]: Successfully connected");
  } catch (error) {
    console.error("[MongoDB] Connection Error:", error);
    process.exit(1);
  }
}

export const database = mongoose.connection;
