// components/TaskList.tsx
import styles from './styles.module.css'
import clsx from 'clsx'
import type { IListItem } from '../../features/TaskList/types'
import React, { useState } from 'react';


// Интерфейс для пропсов компонента
interface IItemListProps {
  items?: IListItem[]; // Необязательный массив элементов
  onItemClick?: (item: IListItem) => void; // Обработчик клика по элементу
  className?: string; // Дополнительные классы стилей
}


// Компонент списка элементов
export const TaskItemList: React.FC<IItemListProps> = ({
  items = [],
  onItemClick,
  className = ''
}) => {

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Обработчик клика по элементу
  const handleItemClick = (item: IListItem) => {
    setSelectedItemId(item.id);
    onItemClick?.(item);
  };

  // Если список пустой
  if (items.length === 0) {
    return (
      <div className={`item-list empty ${className}`}>
        <p>Список пуст</p>
      </div>
    );
  }

  return (
     <div className={`${styles['item-list']} ${className}`}>
      <ul className={styles['item-list__container']}>
        {items.map((item) => (
          <li
            key={item.id}
            className={clsx(styles['item-list__item'], {
              [styles['item-list__item--selected']] : selectedItemId === item.id,
              [styles['item-list__item--completed']] : item.completed
            })}
            onClick={() => handleItemClick(item)}
          >
            <div className={styles['item-list__content']}>
              <h3 className={styles['item-list__title']}>{item.name}</h3>
              <p className={styles['item-list__description']}>{item.description}</p>
            </div>
            {item.completed && (
              <span className={styles['item-list__status']}>✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

//export default TaskItemList;

// Пример использования компонента:
/*
const App: React.FC = () => {
  const sampleItems: ListItem[] = [
    {
      id: 1,
      title: 'Первая задача',
      description: 'Описание первой задачи',
      completed: false
    },
    {
      id: 2,
      title: 'Вторая задача',
      description: 'Описание второй задачи',
      completed: true
    },
    {
      id: 3,
      title: 'Третья задача',
      description: 'Описание третьей задачи',
      completed: false
    }
  ];

  const handleItemClick = (item: ListItem) => {
    console.log('Выбран элемент:', item);
  };

  return (
    <div>
      <h1>Мой список задач</h1>
      <ItemList 
        items={sampleItems} 
        onItemClick={handleItemClick}
        className="my-custom-class"
      />
    </div>
  );
};
*/
