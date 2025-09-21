// pages/TaskListSolidPage.tsx
import React from 'react';
// import { SolidWrapper } from '../../features/SolidWrapper'
// import { ComponentLoader } from '../../features/ComponentLoader';
// import { useNavigate } from 'react-router-dom';

// Интерфейс для пропсов компонента
interface ITaskListSolidPageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const TaskListSolidPage: React.FC<ITaskListSolidPageProps> = ({
    className = ''
}) => {
    // const navigate = useNavigate();

    // const resetMethod = function(details : any) {
    //   console.info('Перезагрузка компонента TaskApp:', details);
    //   // попытка перезагрузки страницы
    //   navigate(0);     
    // }

    return (
    <div className={`task-list ${className}`}>
        <p>Todo list Solid</p>
        {/* <ComponentLoader resetMethod={resetMethod} >
          <SolidWrapper modulePathName='solid_task_app/SolidTaskApp' />
        </ComponentLoader> */}
    </div>
  );
};