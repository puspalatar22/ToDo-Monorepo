import { Task } from "models";

export const TASK_FEATURE_KEY = 'tasks';

export interface TaskState {
    tasks: Task[];
}

export const initialState: TaskState = {
    tasks: []
};