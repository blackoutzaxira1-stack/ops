# ---------- 1-STAGE: Dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

# Faqat dependency fayllarini ko'chiramiz
COPY package.json package-lock.json ./

# Production dependency'larni o'rnatamiz
RUN npm ci --only=production


# ---------- 2-STAGE: Runtime ----------
FROM node:20-alpine

WORKDIR /app

# Nodeni production mode'da ishlatamiz
ENV NODE_ENV=production

# 1-stage'dan node_modules ni olamiz
COPY --from=deps /app/node_modules ./node_modules

# App source code
COPY src ./src
COPY package.json ./

# Default port (override qilinadi)
ENV PORT=3000

EXPOSE 3000

# App ishga tushishi
CMD ["node", "src/index.js"]
