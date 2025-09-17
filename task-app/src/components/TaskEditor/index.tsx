// components/TaskEditor.tsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {TaskItemList } from '../TaskList'
import TaskInput from '../TaskInput'
import type { IListItem, ITaskListState } from '../../features/TaskList/types'

import { addTask } from '../../features/TaskList/tasksSlice'
import type { RootState } from '../../app/store'


// Интерфейс для пропсов компонента
interface ITaskListEditorProps {
    initTask? : string,
    initItems? : IListItem[],
    className?: string; // Дополнительные классы стилей
}

// Компонент редактора списка
const TaskListEditor: React.FC<ITaskListEditorProps> = ({
    initTask = "",
    className = ''
}) => {
 
    const [newTask, setNewTask] = useState(initTask);
    // const [tasks, setTasks] = useState(initItems);

    const dispatch = useDispatch();
    const { tasks } = useSelector<RootState, ITaskListState>(state => state.tasks);

    const getNextId = function(tasks : IListItem[]) {
        if (tasks.length == 0) return 1;
        return tasks.at(-1)!.id + 1;
    };
    
    const onSubmit = (value : string) => {
        const newTask = { 
            id : getNextId(tasks),
            name : value,
            description : '',
            completed : false
        } as IListItem;
        
        dispatch(addTask(newTask));

        //setTasks((tasks) => [...tasks, newTask]);
        setNewTask("");
    };

    return (
    <div className={`task-editor ${className}`}>
        <TaskInput 
            value={newTask}
            buttonText='Добавить задачу'
            placeholder='Введите название задачи'
            required
            onSubmit={onSubmit}>
        </TaskInput>
        <TaskItemList
            items={tasks}
            >
        </TaskItemList>
    </div>
  );
};

export default TaskListEditor;