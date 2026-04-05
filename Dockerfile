FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts && npm rebuild
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
RUN apk add --no-cache curl
COPY --from=builder /app/.output .output
COPY --from=builder /app/data ./data-seed
RUN mkdir -p /app/data && chown -R app:app /app
USER app
EXPOSE 3000
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:3000/api/health || exit 1
CMD sh -c 'mkdir -p /app/data && for f in data-seed/*.json; do target="data/$(basename $f)"; [ -f "$target" ] || cp "$f" "$target"; done && node .output/server/index.mjs'
