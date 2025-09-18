import { useState, useEffect } from 'react';

interface UseVueComponentResult {
  component: any;
  isLoading: boolean;
  error: string | null;
}

export const useVueComponent = (
  componentImporter: () => Promise<{ default: any }>
): UseVueComponentResult => {
  const [component, setComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const module = await componentImporter();
        if (isMounted) {
          setComponent(module.default);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка загрузки компонента Vue');
          setIsLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [componentImporter]);

  return { component, isLoading, error };
};
