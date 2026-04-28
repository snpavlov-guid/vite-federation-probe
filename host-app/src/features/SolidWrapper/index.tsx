import React, { useEffect, useRef } from 'react';
import type { Component } from 'solid-js';
import styles from './styles.module.css';

/**
 * Стили контейнера на стороне хоста нужны потому что CSS-modules remote-приложения
 * (solid `.app-root`) часто не инжектятся в документ хоста — без них пропадают
 * text-align / flex-колонка и блоки «едут» в разные стороны.
 */

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
