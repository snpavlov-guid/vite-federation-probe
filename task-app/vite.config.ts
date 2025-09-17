import { defineConfig } from 'vite'
//import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      //name: "task-components",
      // filename: "task-components-entry.js",
      // exposes: {
      //   "./TaskListEditor": "./src/components/TaskEditor",
      // },
      name: "task-app",
      filename: "task-app-entry.js",
      exposes: {
         "./TaskApp": "./src/App",
      },
      shared: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"],

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
    port: 5173, // Замените на нужный порт
    //host: '0.0.0.0', // Опционально: чтобы сервер был доступен в сети
  },
  preview: {
    port: 4173, // Порт для сервера превью
  },

})
