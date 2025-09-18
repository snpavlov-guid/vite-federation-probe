<script setup lang="ts">
  import {ref} from "vue";
  import type { IListItem } from "../features/TaskList/types"

  const tasks = ref<IListItem[]>([
    {
      id: 1,
      name: 'Первая задача',
      description: 'Описание первой задачи',
      completed: false
    },
    {
      id: 2,
      name: 'Вторая задача',
      description: 'Описание второй задачи',
      completed: true
    },
    {
      id: 3,
      name: 'Третья задача',
      description: 'Описание третьей задачи',
      completed: false
    }
  ])
  const newTask = ref<string>("")

  const getNextId = function(tasks : IListItem[]) {
    if (tasks.length == 0) return 1;
    return tasks[tasks.length - 1]!.id + 1;
  };

  const addTask = () => {
    if (newTask.value.trim()) {
      tasks.value.push(
        {   id: getNextId(tasks.value), 
            name: newTask.value,
            completed: false
        });
      newTask.value = ""
    }
  }

  const removeTask = (id: number) => {
    tasks.value = tasks.value.filter(item => item.id !== id)
  }

</script>

<template>
  <div>
    <form @submit.prevent="addTask" class="input-form">
        <div class="input-form__group">
            <input type="text" name="new-task" 
                v-model="newTask" 
                class="input-form__input"
                placeholder="Введите название задачи">
            <button type="submit" :disabled="!newTask"
            class="input-form__button button--medium">Добавить задачу</button>
        </div>
    </form>

    <div class="item-list">
        <div v-if="tasks.length === 0" class="empty">
            <p>Список пуст</p>
        </div>
        <ul class="item-list__container">
            <li v-for="task in tasks" :key="task.id" class="item-list__item">
            <div>
                <h3 class="item-list__title">{{ task.name }}</h3>
                <p class="item-list__description" v-if="!!task.description">{{ task.description }}</p>
            </div>
            <div class="item-list__control">
              <button 
                  v-if="task.completed === false"
                  @click="removeTask(task.id)" 
                  aria-label="Удалить задачу">x</button>
              <span 
                  v-if="task.completed === true"
                  class="item-list__status">✓</span>
              </div>
            </li>
        </ul>
    </div>

  </div>
</template>

<style scoped>

.input-form {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom : 0.5em;
}

.input-form__group {
  flex: 1;
  display: flex;
  flex-direction: row;
  column-gap: 5px;
}

.input-form__input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  outline: none;
  width: 100%;
}

.input-form__input:focus {
  border-color: #2196f3;
}

.input-form__input--error {
  border-color: #f44336;
}

.input-form__input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-form__error {
  color: #f44336;
  font-size: 14px;
  margin-top: 4px;
}

.input-form__button {
  padding: 12px 24px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.input-form__button:hover:not(:disabled) {
  background-color: #1976d2;
}

.input-form__button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
  pointer-events: none;
}

.button--small {
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
}

.button--medium {
  font-size: 1.1rem;
  padding: 0.6rem 0.8rem;
}

.button--large {
  font-size: 1.2rem;
  padding: 0.8rem 1rem;
}

.item-list {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.item-list .empty {
  padding: 20px;
  text-align: center;
  color: #666;
}

.item-list__container {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item-list__item {
  padding: 4px 8px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.item-list__item:hover {
  background-color: #f8f9fa;
}

.item-list__item--selected {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.item-list__item--completed {
  opacity: 0.7;
}

.item-list__item:last-child {
  border-bottom: none;
}

.item-list__content {
  flex: 1;
}

.item-list__title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: left;
}

.item-list__description {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: left;
}

.item-list__control {
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: wrap
}

.item-list__status {
  color: #4caf50;
  font-weight: bold;
  width: 48px;
  text-align: center;
}

</style>