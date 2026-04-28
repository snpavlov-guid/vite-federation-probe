
declare module 'task_app/TaskApp' {

    export default function TaskApp();
    
}

declare module 'league_app/LeagueApp' {
    export default function LeagueApp();
}

// types/vue-federation.d.ts
declare module 'vue_task_app/VueTaskApp' {
  // import { Component } from 'vue';
  // const VueTaskApp: Component;
  // export default VueTaskApp;

  export default function VueTaskApp();
}

// types/remote.d.ts
declare module 'solid_task_app/SolidTaskApp' {
  import type { Component } from 'solid-js';
  const SolidTaskApp: Component;
  export default SolidTaskApp;
}
