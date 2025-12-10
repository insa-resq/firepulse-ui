FROM node:22.19.0-alpine AS base-stage

WORKDIR /app

FROM base-stage AS build-stage

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM base-stage AS runtime-stage

COPY --chown=node:node --from=build-stage /app/dist/resQ ./

USER node

ENV NODE_ENV=production
ENV PORT=4200

CMD ["node", "server/server.mjs"]
