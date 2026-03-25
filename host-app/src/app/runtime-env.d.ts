export {};

declare global {
  interface Window {
    app?: {
      env?: Record<string, string>;
    };
  }
}
