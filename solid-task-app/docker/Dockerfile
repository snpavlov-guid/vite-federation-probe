FROM node:22-alpine AS build

WORKDIR /app/solid-task-app

COPY solid-task-app/package*.json ./
RUN npm ci

COPY solid-task-app/src /app/solid-task-app/src
COPY solid-task-app/public /app/solid-task-app/public
COPY solid-task-app/index.html /app/solid-task-app/index.html
COPY solid-task-app/vite.config.ts /app/solid-task-app/vite.config.ts
COPY solid-task-app/tsconfig*.json /app/solid-task-app/
RUN npm run build

FROM nginx:alpine AS production

COPY solid-task-app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/solid-task-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
