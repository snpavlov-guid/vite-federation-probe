import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SolidWrapper } from '../../features/SolidWrapper';
import { ComponentLoader } from '../../features/ComponentLoader';
import styles from './styles.module.css';

interface ITaskListSolidPageProps {
  className?: string;
}

export const TaskListSolidPage: React.FC<ITaskListSolidPageProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();

  const resetMethod = () => {
    navigate(0);
  };

  return (
    <div className={`${styles.page} ${className}`}>
      <h2 className={styles.pageHeading}>Список задач Solid</h2>
      <ComponentLoader resetMethod={resetMethod}>
        <SolidWrapper />
      </ComponentLoader>
    </div>
  );
};
