// pages/TaskListVuePage.tsx
import React from 'react';
import VueWrapper from '../../features/VueWrapper';
import { useVueComponent } from '../../features/VueWrapper/useVueComponent';

// Интерфейс для пропсов компонента
interface ITaskListVuePageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListVuePage: React.FC<ITaskListVuePageProps> = ({
    className = ''
}) => {

    // Вариант 1: С использованием хука
    const { component: VueTaskApp, isLoading, error } = useVueComponent(
        () => import('vue_task_app/VueTaskApp')
    );

    return (
    <div className={`task-list ${className}`}>
        
        {/* Вариант 1 */}
        {VueTaskApp && (
            <VueWrapper component={VueTaskApp} msg="Сообщение из React'а!" />
        )}

        {isLoading && <p>Loading Vue component...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

    </div>
  );
};