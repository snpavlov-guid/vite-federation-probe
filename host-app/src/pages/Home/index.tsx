// pages/Home.tsx
import React from 'react';


// Интерфейс для пропсов компонента
interface IHomePageProps {
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const HomePage: React.FC<IHomePageProps> = ({
    className = ''
}) => {

    return (
    <div className={className}>
        <h2>Vite federation демо приложение</h2>
    </div>
  );
};
