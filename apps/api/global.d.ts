// Bun.env
declare namespace Bun {
  const env: {
    DATABASE_URL: string;
    DATABASE_NAME: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  };
}
