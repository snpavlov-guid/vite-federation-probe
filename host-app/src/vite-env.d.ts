/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REMOTE_LEAGUEAPP_URL: string;
  readonly VITE_REMOTE_TASKAPPREACT_URL: string;
  readonly VITE_REMOTE_TASKAPPVUE_URL: string;
  readonly VITE_REMOTE_TASKAPPSOLID_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
