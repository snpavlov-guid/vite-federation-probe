// pages/TaskListReactPage.tsx
import styles from './styles.module.css'
import React from 'react';
import TaskApp from 'task_app/TaskApp';


// Интерфейс для пропсов компонента
interface ITaskListReactPageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListReactPage: React.FC<ITaskListReactPageProps> = ({
    className = ''
}) => {

    return (
    <div className={`${styles['task-list']} ${className}`}>
        <TaskApp />
    </div>
  );
};
