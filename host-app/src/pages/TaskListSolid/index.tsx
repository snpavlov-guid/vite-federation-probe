// pages/TaskListSolidPage.tsx
import React from 'react';

// Интерфейс для пропсов компонента
interface ITaskListSolidPageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListSolidPage: React.FC<ITaskListSolidPageProps> = ({
    className = ''
}) => {

    return (
    <div className={`task-list ${className}`}>
        <p>Todo list Solid</p>
    </div>
  );
};