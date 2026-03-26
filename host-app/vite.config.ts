import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolveHostEnv } from './vite-env-resolve'

function remoteEntryHref(path: string, baseUrl: string | undefined): string {
  if (!baseUrl?.trim()) {
    throw new Error(`Missing remote base URL for ${path}`)
  }
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return new URL(path, base).href
}

// https://vite.dev/config/
export default defineConfig((config) => {
  const env = resolveHostEnv(config.mode)

  return {
  plugins: [
    react(),
    tsconfigPaths(),
    federation({
      name: "host-app",
      remotes: {
          task_app: remoteEntryHref("assets/task-app-entry.js", env.VITE_REMOTE_TASKAPPREACT_URL),
          vue_task_app: remoteEntryHref("assets/vue-task-app-entry.js", env.VITE_REMOTE_TASKAPPVUE_URL),
          solid_task_app: remoteEntryHref("assets/solid-task-app-entry.js", env.VITE_REMOTE_TASKAPPSOLID_URL),
          league_app: remoteEntryHref("assets/league-app-entry.js", env.VITE_REMOTE_LEAGUEAPP_URL),
      },
      shared: [
        "react", "react-dom", "react-redux", "@reduxjs/toolkit",
        "vue", "solid-js"
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    //assetsDir: "assets",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5174, // Замените на нужный порт
    //host: '0.0.0.0', // Опционально: чтобы сервер был доступен в сети
    // proxy: {
    //   '/assets': {
    //     target: 'http://localhost:4173', // URL удаленного приложения
    //     changeOrigin: true,
    //   },
    // },
   },
   preview: {
    port: 4174, // Порт для сервера превью
  },
};
})
