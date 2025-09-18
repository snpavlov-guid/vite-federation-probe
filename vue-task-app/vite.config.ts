import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "task-app",
      filename: "vue-task-app-entry.js",
      exposes: {
         "./VueTaskApp": "./src/App.vue",
      },
      shared: ["vue"],
    }),
  ],
  build: {
    assetsInlineLimit: 1024 * 10
  },  
  server: {
    port: 5175, // Замените на нужный порт
    //host: '0.0.0.0', // Опционально: чтобы сервер был доступен в сети
  },
  preview: {
    port: 4175, // Порт для сервера превью
  },  
})
