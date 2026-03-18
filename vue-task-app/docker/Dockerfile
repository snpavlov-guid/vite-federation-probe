FROM node:22-alpine AS build

WORKDIR /app/vue-task-app

COPY vue-task-app/package*.json ./
RUN npm ci

COPY vue-task-app/src /app/vue-task-app/src
COPY vue-task-app/public /app/vue-task-app/public
COPY vue-task-app/index.html /app/vue-task-app/index.html
COPY vue-task-app/vite.config.ts /app/vue-task-app/vite.config.ts
COPY vue-task-app/tsconfig*.json /app/vue-task-app/
RUN npm run build

FROM nginx:alpine AS production

COPY vue-task-app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/vue-task-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
