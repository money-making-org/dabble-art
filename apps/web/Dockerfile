FROM oven/bun:latest AS builder
RUN apt-get update && apt-get install -y libc6

WORKDIR /app

# Copy root workspace files first
COPY package.json bun.lock ./

# Copy all workspace packages
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN bun install

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN cd apps/web && NODE_ENV=production bun run build

FROM oven/bun:latest AS runner
RUN apt-get update && apt-get install -y libc6

WORKDIR /app

# Create a non-root user for increased security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs
USER nextjs

# Copy over the built artifacts
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Runtime environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]