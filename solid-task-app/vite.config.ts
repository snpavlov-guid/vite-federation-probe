import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
  solid(),
    federation({
    name: "task-app",
    filename: "solid-task-app-entry.js",
    exposes: {
        "./SolidTaskApp": "./src/App",
    },
    shared: ["solid-js"],
  }),
  
  ],
   server: {
    port: 5176, // Замените на нужный порт
    //host: '0.0.0.0', // Опционально: чтобы сервер был доступен в сети
  },
  preview: {
    port: 4176, // Порт для сервера превью
  },   
})
