import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig(() => {
  //const env = loadEnv(config.mode, process.cwd(), '')

  return {
  plugins: [
    react(),
    tsconfigPaths(),
    federation({
      name: "host-app",
      // remotes: {
      //     task_components: "http://localhost:4173/assets/task-components-entry.js",
      // },
      remotes: {
          task_app: "http://localhost:4173/assets/task-app-entry.js",
      },
      shared: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    assetsDir: "assets",
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
