import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TASK_FEATURE_KEY, TaskState } from "./task.state";

export const selectedTaskState = createFeatureSelector<TaskState>(TASK_FEATURE_KEY);

export const selectAllTasks = createSelector(
  selectedTaskState,
  state => state.tasks
);

export const completedTasks = createSelector(
  selectAllTasks,
  tasks => tasks.filter(task => task.completed)
);

export const pendingTasks = createSelector(
  selectAllTasks,
  tasks => tasks.filter(task => !task.completed)
);
