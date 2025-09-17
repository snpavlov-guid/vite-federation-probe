import React, { useState, type FormEvent } from 'react';
import styles from './styles.module.css'
import clsx from 'clsx'

// cd /path/to/local-package
// npm link
// cd /path/to/your-project
// npm link local-package
import { BrandButton } from 'shared-react-ui'


// Интерфейс для пропсов компонента
interface InputFormProps {
  onSubmit: (value: string) => void; // Функция обработки отправки формы
  value? : string, // значение по умолчанию
  placeholder?: string; // Плейсхолдер для input
  buttonText?: string; // Текст кнопки
  disabled?: boolean; // Блокировка формы
  className?: string; // Дополнительные классы
  inputType?: 'text' | 'email' | 'password' | 'number'; // Тип input
  required?: boolean; // Обязательное поле
}

// Компонент формы с полем ввода
const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  value,
  placeholder = 'Введите текст...',
  buttonText = 'Отправить',
  disabled = false,
  className = '',
  inputType = 'text',
  required = false
}) => {
  const [inputValue, setInputValue] = useState<string>(value??'');
  const [isTouched, setIsTouched] = useState<boolean>(false);

  // Валидация - проверяем, не пустое ли поле если оно обязательное
  const isInvalid = required && isTouched && inputValue.trim() === '';

  // Обработчик изменения значения в input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Обработчик отправки формы
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setIsTouched(true);
    
    // Проверяем валидность если поле обязательное
    if (required && inputValue.trim() === '') {
      return;
    }

    // Вызываем колбэк с очищенным значением
    onSubmit(inputValue.trim());
    
    // Очищаем поле после отправки
    setInputValue('');
    setIsTouched(false);
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`${styles['input-form']} ${className}`}
      noValidate
    >
      <div className={styles['input-form__group']}>
        <input
          type={inputType}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(styles['input-form__input'], {
            [styles['input-form__input--error']] : isInvalid
          })}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? "error-message" : undefined}
        />
        
        {isInvalid && (
          <div id="error-message" className={styles['input-form__error']}>
            Это поле обязательно для заполнения
          </div>
        )}
      </div>

      <BrandButton
        type="submit"
        label={buttonText}
        disabled={disabled || (required && inputValue.trim() === '')} >
      </BrandButton>

      {/* <button
        type="submit"
        disabled={disabled || (required && inputValue.trim() === '')}
        className={styles['input-form__button']}
      >
        {buttonText}
      </button> */}

    </form>
  );
};

export default InputForm;

// Пример использования компонента:
/*
const App: React.FC = () => {
  const handleSubmit = (value: string) => {
    console.log('Отправленное значение:', value);
    // Здесь можно сделать API запрос или обновить состояние
  };

  return (
    <div>
      <h1>Добавление задачи</h1>
      
      <InputForm
        onSubmit={handleSubmit}
        placeholder="Введите название задачи..."
        buttonText="Добавить"
        required={true}
        className="task-form"
      />
      
      <h2>Форма для email (необязательная)</h2>
      
      <InputForm
        onSubmit={handleSubmit}
        placeholder="Введите ваш email..."
        buttonText="Подписаться"
        inputType="email"
        className="email-form"
      />
    </div>
  );
};
*/
