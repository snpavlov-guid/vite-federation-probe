
// Интерфейс для элемента списка
export interface IListItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export interface ITaskListState {
  tasks: IListItem[],
  filter: 'all' | 'active' | 'completed'
};
