
declare module 'task_app/TaskApp' {

    export default function TaskApp();
    
}

// types/vue-federation.d.ts
declare module 'vue_task_app/VueTaskApp' {
  import { Component } from 'vue';
  const VueTaskApp: Component;
  export default VueTaskApp;
}