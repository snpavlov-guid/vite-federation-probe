//import styles from './styles.module.css'
import React from 'react';
import { type ReactNode, type ErrorInfo, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Интерфейс для пропсов компонента
interface IComponentLoaderProps {
    children : ReactNode,
    loadingMsg? : string,
    loadErrorMsg? : string,
    resetButtonText? : string,
    resetMethod : (details:any) => void,
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
export const ComponentLoader: React.FC<IComponentLoaderProps> = ({
    children,
    loadingMsg = 'Загрузка компонента...',
    loadErrorMsg = 'Ошибка загрузки компонента',
    resetButtonText = 'Попробовать снова',
    resetMethod,
    className = ''
}) => {

    function errorFallback({ error , resetErrorBoundary } : 
        {error : ErrorBoundaryError , resetErrorBoundary : any}) {
        return (
            <div role="alert">
                <p>{loadErrorMsg}:</p>
                <pre>{error.message}</pre>
                <button onClick={resetErrorBoundary}>{resetButtonText}</button>
            </div>
        );
    }

    const logLoadError = function(error: Error, info: ErrorInfo) {
        console.error('ComponentLoader error:', error);
        console.error('ComponentLoader error info:', info);
    }

    return (
    <div className={`${className}`}>
        <ErrorBoundary 
            FallbackComponent={errorFallback}
            onError={logLoadError}
            onReset={resetMethod} >
            <Suspense fallback={<div>{loadingMsg}</div>}>
                {children}
            </Suspense>
        </ErrorBoundary>

    </div>

  );
};
