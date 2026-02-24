import { createReducer, on } from '@ngrx/store';
import { Task } from 'models';
import * as TaskActions from './task.actions';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = { tasks: [] };

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks })),
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
  on(TaskActions.updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
  })),
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  on(TaskActions.toggleTaskCompletion, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    ),
  })),
);
