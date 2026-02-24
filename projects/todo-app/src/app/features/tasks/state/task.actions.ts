import { createAction, props } from "@ngrx/store";
import { Task } from "models";

export const addTask = createAction('[Task] Add Task', props<{task : Task}>());
export const updateTask = createAction('[Task] Update Task', props<{task: Task}>());
export const deleteTask = createAction('[Task] Delete Task', props<{id: string}>());
export const toggleTaskCompletion = createAction('[Task] Toggle Task Completion', props<{id: string}>());
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
