FROM node:22-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --include=dev --legacy-peer-deps
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]