
import { createSlice } from '@reduxjs/toolkit';
import type { IListItem, ITaskListState } from './types';

const sampleItems: IListItem[] = [
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
  ];


const initialState = {
  tasks: sampleItems as IListItem[],
  filter: 'all' as string // all, active, completed
} as ITaskListState;

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = action.payload as IListItem;
      state.tasks.push(newTask);
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    editTask: (state, action) => {
      const { id, name } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.name = name;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.tasks = state.tasks.filter(task => !task.completed);
    }
  }
});

export const { 
  addTask, 
  toggleTask, 
  deleteTodo, 
  editTask, 
  setFilter, 
  clearCompleted 
} = tasksSlice.actions;

export default tasksSlice.reducer;