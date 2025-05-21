FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --include=dev --legacy-peer-deps
# Set NODE_ENV to production for optimal build
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Copy necessary files from builder stage
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Configure Next.js to listen on all interfaces
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Default to production environment
ENV NODE_ENV=production
# GEMINI_API_KEY will be set via Render environment variables
EXPOSE 3000
# Add health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["node", "server.js"]