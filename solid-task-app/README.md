# solid-task-app — SolidJS remote (Module Federation)

Микрофронтенд на **SolidJS** + **Vite** и **[@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)**: при сборке публикуется **remote entry** (`solid-task-app-entry.js`), который **host-app** подгружает во время выполнения. Отдельно от приложения задаётся публичный CSS `assets/solid-remote-ui.css` (для встраивания в React-обёртке host через `SolidWrapper`).

## Стек и роль в монорепозитории

- **SolidJS** — UI репозитория задач во втором технологическом remote (рядом с React `task-app`, Vue `vue-task-app` и приложением РПЛ).
- **TypeScript**, **vite-plugin-solid** — сборка и HMR как в типичном Vite-проекте.
- **Совместимость с host**: в `host-app` указан ключ remote `solid_task_app`, модуль `./SolidTaskApp`; в `shared` участвует `solid-js` (версию держите согласованной с `host-app/package.json`).

## Конфигурация Federation (`vite.config.ts`)

Кратко:

- **`filename`**: `solid-task-app-entry.js` (после базового URL: `assets/solid-task-app-entry.js`).
- **`exposes`**: `./SolidTaskApp` → `./src/App`.
- **`shared`**: `solid-js`.
- **CSS**: сборка без `cssCodeSplit`, фиксированное имя `assets/solid-remote-ui.css`.

Порты Vite задаются в этом же файле:

- **`dev`**: по умолчанию **5176** (`server.port`).
- **`preview`** (результат `vite build`): **4176** (`preview.port`).

## Локальная разработка

```bash
cd solid-task-app
npm ci       # или npm install
npm run dev
```

Открыть приложение: [http://localhost:5176](http://localhost:5176).

### Связка с host-app без Docker

В корне **`host-app`** задайте базовый URL до этого remote с **завершающим слешем** (как для остальных `VITE_REMOTE_*`), например в `.env.development`:

```env
VITE_REMOTE_TASKAPPSOLID_URL=http://localhost:5176/
```

Запустите `solid-task-app` на 5176 и **host-app** своим `npm run dev`. Учитывайте, что другой порт даст другой origin; при необходимости настройте CORS или работайте через один origin (как в Docker-прокси host).

### Сборка и превью production

```bash
npm run build   # tsc -b && vite build, артефакты в dist/
npm run preview # по умолчанию http://localhost:4176
```

Для host укажите `VITE_REMOTE_TASKAPPSOLID_URL=http://localhost:4176/` (или свой порт после правки конфига).

## Docker

Сборочный контекст — **корень монорепозитория** (`context: ../..`), образ описан в **`solid-task-app/docker/Dockerfile`**, nginx — **`solid-task-app/docker/nginx.conf`**. Multi-stage: Node (сборка) → `nginx:alpine` (статическая раздача, порт 80).

### Сборка образа

```bash
docker compose -f solid-task-app/docker_compose/solid-task-app-docker-compose.yml build
```

(Команды выполняются из каталога `solid-task-app` или укажите путь относительно корня репозитория.)

### Запуск контейнера

```bash
docker compose -f solid-task-app/docker_compose/solid-task-app-docker-compose.yml up --build
```

Приложение на хосте: [http://localhost:31024](http://localhost:31024).

### Остановка

```bash
docker compose -f solid-task-app/docker_compose/solid-task-app-docker-compose.yml down
```

### nginx

- SPA: статика из `/usr/share/nginx/html`, fallback `try_files` → `index.html`.
- Заголовки **CORS** разрешают отдачу бандлов с другого origin (прямые запросы к remote). Если remote открывается только через **same-origin** прокси host (`/mf/task-solid/`), браузеру CORS из nginx не нужен — конфиг остаётся полезным при отладке напрямую по порту контейнера.

### Переменные окружения при сборке образа

Отдельных `VITE_*` в Dockerfile по умолчанию не задано; при необходимости добавьте `ARG`/`ENV` перед `npm run build` по аналогии с **`league-app`**.

---

Дополнительно о работе federation и Docker-сценарии для **host-app** см. [корневой README](../README.md) и [host-app/README](../host-app/README.md).
