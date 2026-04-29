# Vite Module Federation — монорепозиторий

Демонстрация **микрофронтендов** на [Vite](https://vite.dev/): одно shell-приложение (**host**) подгружает независимо собираемые **remote** (React, Vue, SolidJS, отдельное React-приложение РПЛ) через **Module Federation**.

## Идея и принципы

- **Host** не встраивает код remotes на этапе сборки целиком: в бандл попадают только **точки входа** remote (`*-entry.js`) и общая логика загрузчика federation. Реальные чанки remote подтягиваются **во время выполнения** по URL (динамический `import()`).
- **Один экземпляр фреймворка** для связанных remotes: в конфигурации задаётся **`shared`** — общие зависимости (например `react` / `react-dom` / `react-redux` / `@reduxjs/toolkit` для React-remotes, `vue` для Vue, `solid-js` для Solid-remote). Так хуки и контекст Redux не «ломаются» между host и remote.
- **Контракт** между приложениями: remote **экспортирует** (`exposes`) конкретные модули (корневой компонент приложения), host **импортирует** их по строковому идентификатору вида `remoteName/ExposedName`.
- **Сборка** каждого приложения остаётся автономной (отдельный `vite build` и отдельный Docker-образ). Версии и порты remotes задаются на уровне **переменных окружения** при сборке host.

## Средства

| Компонент | Назначение |
|-----------|------------|
| **[`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation)** | Плагин Vite для Module Federation: `name`, `filename`, `exposes`, `remotes`, `shared`. |
| **Vite** | Сборка ES-модулей, `import.meta.env` для переменных `VITE_*`. |
| **TypeScript** | В host объявлены модули для remote-импортов (`src/types/*.d.ts`). |

Версия плагина в **host-app** указана в `host-app/package.json` (`@originjs/vite-plugin-federation`).

## Конфигурация host (`host-app`)

Файл: `host-app/vite.config.ts`.

- **`federation({ name: "host-app", remotes, shared })`**
  - **`remotes`** — абсолютные URL до **remote entry** (файл `assets/<имя>-entry.js`). Базовый URL задаётся через `VITE_REMOTE_*` и нормализуется функцией `remoteEntryHref` (база **с завершающим `/`**, чтобы `new URL("assets/...", base)` резолвился корректно).
  - Имена remotes и соответствующие переменные:

    | Ключ в `remotes` | Переменная окружения | Файл entry (после базового URL) |
    |------------------|----------------------|----------------------------------|
    | `league_app` | `VITE_REMOTE_LEAGUEAPP_URL` | `assets/league-app-entry.js` |
    | `task_app` | `VITE_REMOTE_TASKAPPREACT_URL` | `assets/task-app-entry.js` |
    | `vue_task_app` | `VITE_REMOTE_TASKAPPVUE_URL` | `assets/vue-task-app-entry.js` |
    | `solid_task_app` | `VITE_REMOTE_TASKAPPSOLID_URL` | `assets/solid-task-app-entry.js` |

  - **`shared`**: список пакетов, которые разделяются между host и remotes (см. `package.json` host — зависимости должны быть согласованы по major с remote).

- **Загрузка в UI**: динамический импорт в стиле `import('league_app/LeagueApp')` и обёртка в `React.lazy` / `Suspense` (см. страницы в `host-app/src/pages`).

Подстановка `VITE_*` при сборке: `host-app/vite-env-resolve.ts` (merge `loadEnv` и `process.env` для Docker/CI).

## Конфигурация remote-приложений

Общие паттерны в `vite.config.ts` каждого remote:

- **`federation({ name: "...", filename: "*-entry.js", exposes: { "./X": "./src/..." }, shared: [...] })`**
  - **`name`** — внутреннее имя контейнера federation (должно согласовываться с тем, как host ссылается на remote в импортах; на host используются ключи `remotes` выше).
  - **`filename`** — имя файла remote entry в каталоге `assets/` после сборки.
  - **`exposes`** — публичные модули (например `"./LeagueApp": "./src/App"`).
  - **`shared`** — те же библиотеки, что и у host для данного стека (React + Redux для league/task-app, Vue для vue-task-app, **`solid-js`** для solid-task-app).

Примеры в репозитории:

- `league-app/vite.config.ts` — `league-app-entry.js`, exposes `./LeagueApp`, `dedupe` для React.
- `task-app/vite.config.ts` — `task-app-entry.js`, exposes `./TaskApp`.
- `vue-task-app/vite.config.ts` — `vue-task-app-entry.js`, exposes `./VueTaskApp`.
- `solid-task-app/vite.config.ts` — `solid-task-app-entry.js`, exposes `./SolidTaskApp`, общий **`solid-js`**, фиксированный **`assets/solid-remote-ui.css`**.

## Импорты и типы

В host для TypeScript объявлены модули, например:

- `league_app/LeagueApp`
- `task_app/TaskApp`
- `vue_task_app/VueTaskApp`
- `solid_task_app/SolidTaskApp`

Файлы: `host-app/src/types/index.d.ts` (и связанные декларации).

## Переменные окружения и Docker

- **Сборка host**: в `docker` и локально для production нужны **`VITE_REMOTE_*`** — полные базовые URL до remotes (в типичной схеме с **same-origin** прокси через nginx host — это `http://localhost:<порт-хоста>/mf/<путь>/...`, см. `host-app/.env.production`).

- **Remotes в Docker**: статика раздаётся **nginx**; отдельные порты на хосте (`31021`–`31024` для league / React-task / Vue-task / Solid-task) и прокси в **host** (`nginx` + `host.docker.internal`, в т.ч. `/mf/task-solid/` → `:31024`) описаны в **`host-app/README.md`**.

- **League-app** при встраивании в host требует, чтобы чувствительные **`VITE_APP_*`** были доступны в **`import.meta.env`** при сборке образа (страница host не загружает `env-config.js` remote). Подробности — в **`league-app/README.md`**.

## Документация по приложениям

| Приложение | README |
|------------|--------|
| Host | `host-app/README.md` |
| League (РПЛ) | `league-app/README.md` |
| Task (React) | `task-app/README.md` |
| Task (Vue) | `vue-task-app/README.md` |
| Task (Solid) | `solid-task-app/README.md` |
| Shared UI | `packages/shared-react-ui/README.md` |

## Локальная разработка без Docker

1. Поднять remotes (например `npm run dev` / `preview` на портах из их `vite.config.ts`).
2. В `host-app` задать `VITE_REMOTE_*` на эти URL (или через `.env.development`).
3. Запустить `host-app`: `npm run dev`.

Учитывайте **CORS** при разных origin (порт = другой origin). В Docker-стенде используется **один origin** для UI и remotes через прокси nginx в host.
