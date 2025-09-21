//import styles from './styles.module.css'
import React, { lazy } from 'react';
import { convertToReactComponent } from 'react-solid-bridge';

// Интерфейс для пропсов компонента
interface ISolidWrapperProps {
    modulePathName: string, 
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const SolidWrapper: React.FC<ISolidWrapperProps> = ({
    modulePathName,
    className = ''
}) => {

    // Динамически загружаем модуль через Module Federation
    const loadSolidJSModule = async () => {
        try {
            // @ts-ignore: Типы для удаленного модуля
            const module = await import(modulePathName);
            return module;
        } catch (error) {
            console.error(`Failed to load '${modulePathName}' module: ${error}`);
            throw error;
        }
    };

    // Создаем lazy-компонент для загрузки SolidJS-модуля
    const SolidJSComponentLazy = lazy(() => 
            loadSolidJSModule().then(module => {
            // Преобразуем SolidJS-компонент в React-компонент
            const ReactSolidComponent = convertToReactComponent(module.default);
            return { default: ReactSolidComponent };
        })
    );
    
    return (
        <div className={`${className}`}>
            <SolidJSComponentLazy />
        </div>
    );
};