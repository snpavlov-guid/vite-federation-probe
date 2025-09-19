// pages/TaskListSolidPage.tsx
import React from 'react';
//import React, { Suspense } from 'react';

// const SolidTaskApp = React.lazy(
//   () => import('solid_task_app/SolidTaskApp')
// );

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
        {/* <Suspense fallback={<div>Loading SolidJS App...</div>}>
            <SolidTaskApp />
        </Suspense> */}
    </div>
  );
};