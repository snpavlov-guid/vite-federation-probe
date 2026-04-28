import React, { useEffect, useRef } from 'react';
import type { Component } from 'solid-js';
import { getEnv } from '../../app/env';
import styles from './styles.module.css';

const SOLID_REMOTE_STYLES_ID = 'solid-task-app-remote-ui-css';

/** Стили Module Federation remote — отдельный `assets/solid-remote-ui.css` (см. solid-task-app vite build). */
function ensureSolidRemoteStylesheet(): void {
  const baseUrl = getEnv('VITE_REMOTE_TASKAPPSOLID_URL');
  if (!baseUrl) return;
  if (document.getElementById(SOLID_REMOTE_STYLES_ID)) return;
  const href = new URL(
    'assets/solid-remote-ui.css',
    baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
  ).href;
  const link = document.createElement('link');
  link.id = SOLID_REMOTE_STYLES_ID;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/** Mounts federated Solid app into a DOM node (no react-solid-bridge; avoids React internals). */
export const SolidWrapper: React.FC<{ className?: string }> = ({ className = '' }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const el = hostRef.current;
    if (!el) return;

    void (async () => {
      try {
        ensureSolidRemoteStylesheet();
        const [{ render }, mod] = await Promise.all([
          import('solid-js/web'),
          import('solid_task_app/SolidTaskApp'),
        ]);
        if (cancelled || hostRef.current !== el) return;

        const SolidTaskApp = mod.default as Component;
        dispose = render(() => SolidTaskApp({}), el);
      } catch (e) {
        console.error('[SolidWrapper] Federation mount failed:', e);
      }
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`${styles.host} ${className}`.trim()}
      data-solid-remote-mount
    />
  );
};
