import React, { useEffect, useRef, useState } from 'react';

// Базовые типы для Vue
interface VueApp {
  unmount: () => void;
}

interface VueComponentOptions {
  template?: string;
  setup?: (props: any, context: any) => any;
  props?: Record<string, any>;
  [key: string]: any;
}

interface VueWrapperProps {
  component: VueComponentOptions | (() => Promise<{ default: VueComponentOptions }>);
  [key: string]: any;
}

const VueWrapper: React.FC<VueWrapperProps> = ({ component, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vueApp: VueApp | null = null;
    let isMounted = true;

    const loadVueComponent = async () => {
      try {
        if (!containerRef.current) return;

        setIsLoading(true);
        setError(null);

        // Динамический импорт Vue
        const vue = await import('vue');
        
        // Разрешаем компонент (обрабатываем как объект, так и функцию импорта)
        let resolvedComponent: VueComponentOptions;
        
        if (typeof component === 'function') {
          const module = await component();
          resolvedComponent = module.default;
        } else {
          resolvedComponent = component;
        }

        if (!isMounted) return;

        // Создаем и монтируем Vue приложение
        vueApp = vue.createApp(resolvedComponent, props);
        
        // mount не определен в интерфейсе приложения Vue, но существует в рантайме
        (vueApp as any).mount(containerRef.current); // откуда этот метод ?
        
        setIsLoading(false);

      } catch (err) {
        if (isMounted) {
          setError(`Ошибка загрузки компонента Vue: ${err instanceof Error ? err.message : String(err)}`);
          setIsLoading(false);
        }
      }
    };

    loadVueComponent();

    return () => {
      isMounted = false;
      if (vueApp) {
        vueApp.unmount();
      }
    };
  }, [component]); // Зависимость только от component

  return (
    <div style={{ position: 'relative', minHeight: '50px' }}>
      <div ref={containerRef} />
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.8)'
        }}>
          Загрузка компонента Vue...
        </div>
      )}
      {error && (
        <div style={{
          padding: '8px',
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          color: '#c62828',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default VueWrapper;