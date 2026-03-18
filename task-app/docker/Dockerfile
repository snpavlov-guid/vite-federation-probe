FROM node:22-alpine AS build

WORKDIR /app

# Build local package first so task-app can install it from file:../packages/shared-react-ui.
COPY packages/shared-react-ui /app/packages/shared-react-ui
RUN npm --prefix /app/packages/shared-react-ui ci && npm --prefix /app/packages/shared-react-ui run build

WORKDIR /app/task-app
COPY task-app/package*.json ./
RUN npm ci
COPY task-app/src /app/task-app/src
COPY task-app/public /app/task-app/public
COPY task-app/index.html /app/task-app/index.html
COPY task-app/vite.config.ts /app/task-app/vite.config.ts
COPY task-app/tsconfig*.json /app/task-app/
RUN npm run build

FROM nginx:alpine AS production

COPY task-app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/task-app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
