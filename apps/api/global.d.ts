declare module "bun" {
  export interface Bun {
    env: {
      DATABASE_URL: string;
      DATABASE_NAME: string;

      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;

      S3_ACCESS_KEY_ID: string;
      S3_SECRET_ACCESS_KEY: string;
      S3_REGION: string;
      S3_ENDPOINT: string;
      S3_BUCKET: string;
      S3_SESSION_TOKEN: string;

      WEBHOOK_URL: string | undefined;

      NODE_ENV: "development" | "production" | undefined
    };
  }
}
