FROM oven/bun:latest

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
RUN bun install

# Expose the port
EXPOSE 3001

# Set production environment
ENV NODE_ENV=production

# Run the TypeScript file directly
CMD ["bun", "apps/api/src/index.ts"]