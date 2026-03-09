import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    federation({
      name: "league-app",
      filename: "league-app-entry.js",
      exposes: {
         "./LeagueApp": "./src/App",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    assetsInlineLimit: 1024 * 10
  },
  server: {
    port: 5181, // Замените на нужный порт
    //host: '0.0.0.0', // Опционально: чтобы сервер был доступен в сети
  },
  preview: {
    port: 4181, // Порт для сервера превью
  },

})
