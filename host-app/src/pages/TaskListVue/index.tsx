// pages/TaskListVuePage.tsx
import React from 'react';

// Интерфейс для пропсов компонента
interface ITaskListVuePageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListVuePage: React.FC<ITaskListVuePageProps> = ({
    className = ''
}) => {

    return (
    <div className={`task-list ${className}`}>
        <p>Todo list Vue</p>
    </div>
  );
};