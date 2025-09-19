// pages/TaskListReactPage.tsx
import styles from './styles.module.css'
import React from 'react';
import { lazy, Suspense } from 'react';
//import TaskApp from 'task_app/TaskApp';
const TaskApp = lazy(() => import('task_app/TaskApp'));
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

function errorFallback({ error , resetErrorBoundary } : 
    {error : ErrorBoundaryError , resetErrorBoundary : any}) {
  return (
    <div role="alert">
      <p>Ошибка загрузки компонента:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Попробовать снова</button>
    </div>
  );
}


// Интерфейс для пропсов компонента
interface ITaskListReactPageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListReactPage: React.FC<ITaskListReactPageProps> = ({
    className = ''
}) => {
    const navigate = useNavigate();

    return (
    <div className={`${styles['task-list']} ${className}`}>
        <ErrorBoundary 
            FallbackComponent={errorFallback}
            onError={(error, info) => {
                // Аналог componentDidCatch
                console.error('Error:', error);
                console.error('Error info:', info);
                // Отправка в Sentry или другой сервис
            }}
            onReset={() => {
                // Очистка состояния после reset
                // refresh
                navigate(0);
            }} >

            <Suspense fallback={<div>Загрузка...</div>}>
                <TaskApp />
            </Suspense>
        </ErrorBoundary>

    </div>
  );
};
