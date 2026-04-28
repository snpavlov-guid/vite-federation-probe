import { createEffect, createSignal, For, onCleanup, Show } from 'solid-js';
import type { IListItem } from '../../features/TaskList/types';
import styles from './TaskEditor.module.css';

const initialTasks: IListItem[] = [
  {
    id: 1,
    name: 'Первая задача',
    description: 'Описание первой задачи',
    completed: false,
  },
  {
    id: 2,
    name: 'Вторая задача',
    description: 'Описание второй задачи',
    completed: true,
  },
  {
    id: 3,
    name: 'Третья задача',
    description: 'Описание третьей задачи',
    completed: false,
  },
];

function getNextId(taskList: IListItem[]) {
  if (taskList.length === 0) return 1;
  return taskList[taskList.length - 1]!.id + 1;
}

function TaskEditor() {
  const [tasks, setTasks] = createSignal<IListItem[]>(initialTasks);
  const [inputEl, setInputEl] = createSignal<HTMLInputElement | undefined>();
  const [addBtnEl, setAddBtnEl] = createSignal<HTMLButtonElement | undefined>();

  const addTask = () => {
    const inp = inputEl();
    const name = inp?.value.trim() ?? '';
    if (!name) return;

    setTasks([
      ...tasks(),
      {
        id: getNextId(tasks()),
        name,
        completed: false,
      },
    ]);

    if (inp) inp.value = '';
    const btn = addBtnEl();
    if (btn) btn.disabled = true;
  };

  const removeTask = (id: number) => {
    setTasks(tasks().filter((item) => item.id !== id));
  };

  /**
   * В хосте (React + MF) реактивный disabled={…} у кнопки может не синхронизироваться с сигналом.
   * Обновляем только свойство DOM — без привязки disabled в JSX.
   */
  createEffect(() => {
    const inp = inputEl();
    const btn = addBtnEl();
    if (!inp || !btn) return;

    const syncButton = () => {
      btn.disabled = !inp.value;
    };

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      addTask();
    };

    inp.addEventListener('input', syncButton, true);
    inp.addEventListener('keyup', syncButton, true);
    btn.addEventListener('click', onClick, true);

    syncButton();

    onCleanup(() => {
      inp.removeEventListener('input', syncButton, true);
      inp.removeEventListener('keyup', syncButton, true);
      btn.removeEventListener('click', onClick, true);
    });
  });

  return (
    <div>
      <form
        class={styles.inputForm}
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <div class={styles.inputFormGroup}>
          <input
            type="text"
            name="new-task"
            class={styles.inputFormInput}
            placeholder="Введите название задачи"
            ref={setInputEl}
          />
          <button
            type="button"
            ref={setAddBtnEl}
            class={`${styles.inputFormButton} ${styles.buttonMedium}`}
          >
            Добавить задачу
          </button>
        </div>
      </form>

      <div class={styles.itemList}>
        <Show when={tasks().length === 0}>
          <div class={styles.empty}>
            <p>Список пуст</p>
          </div>
        </Show>
        <ul class={styles.itemListContainer}>
          <For each={tasks()}>
            {(task) => (
              <li class={styles.itemListItem}>
                <div>
                  <h3 class={styles.itemListTitle}>{task.name}</h3>
                  <Show when={!!task.description}>
                    <p class={styles.itemListDescription}>{task.description}</p>
                  </Show>
                </div>
                <div class={styles.itemListControl}>
                  <Show when={task.completed === false}>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      aria-label="Удалить задачу"
                    >
                      x
                    </button>
                  </Show>
                  <Show when={task.completed === true}>
                    <span class={styles.itemListStatus}>✓</span>
                  </Show>
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
}

export default TaskEditor;
