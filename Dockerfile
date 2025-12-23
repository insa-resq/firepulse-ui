FROM node:22.19.0-alpine AS base-stage

WORKDIR /app

FROM base-stage AS build-stage

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build -- --configuration=production

FROM nginx:alpine AS runtime-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/resQ/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
