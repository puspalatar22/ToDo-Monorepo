import { Injectable } from '@angular/core';
import { Task } from 'models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly STORAGE_KEY = 'tasks';

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }

  loadTasks(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsed: any[] = JSON.parse(data);

    return parsed.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}