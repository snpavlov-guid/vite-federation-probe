// pages/TaskListReactPage.tsx
import styles from './styles.module.css'
import React from 'react';
import { ComponentLoader } from '../../features/ComponentLoader';
import { useNavigate } from 'react-router-dom';
import { lazy } from 'react';
const TaskApp = lazy(() => import('task_app/TaskApp'));

// Интерфейс для пропсов компонента
interface ITaskListReactPageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListReactPage: React.FC<ITaskListReactPageProps> = ({
    className = ''
}) => {
    const navigate = useNavigate();

    const resetMethod = function(details : any) {
      console.info('Перезагрузка компонента TaskApp:', details);
      // попытка перезагрузки страницы
      navigate(0);     
    }

    return (
    <div className={`${styles['task-list']} ${className}`}>
        <ComponentLoader resetMethod={resetMethod} >
          <TaskApp />
        </ComponentLoader>
    </div>
  );
};
