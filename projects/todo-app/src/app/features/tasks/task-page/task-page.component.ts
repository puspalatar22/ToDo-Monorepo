import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from 'models';
import { Observable } from 'rxjs';
import { selectAllTasks } from '../state/task.selector';
import { addTask,loadTasks, toggleTaskCompletion, deleteTask, updateTask} from '../state/task.actions';
import { ToastService } from 'shared-services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss']
})
export class TaskPageComponent {
tasks$: Observable<Task[]>;
currentLang: string = 'en';
selectedTask: Task | null = null;


constructor(private store: Store, @Inject(ToastService) private toastService: ToastService, private translate: TranslateService) {
  this.tasks$ = this.store.select(selectAllTasks);
  this.store.dispatch(loadTasks());
  this.translate.setDefaultLang('en');
  this.translate.use(this.currentLang);

}

  switchLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.translate.use(this.currentLang);
  }

showModal = false;

message: string | null = null;

 openAddModal() {
    this.selectedTask = null;
    this.showModal = true;
  }

  openEditModal(task: Task) {
    this.selectedTask = { ...task }; // clone to avoid direct mutation
    this.showModal = true;
  }

closeModal() {
  this.showModal = false;
}

// handleAddTask(task: { title: string; description?: string }) {
//   this.addTask(task); 
//   this.closeModal();
// }

handleSaveTask(task: { title: string; description?: string }) {
  if (this.selectedTask) {
    const updatedTask: Task = {
      ...this.selectedTask, 
      ...task               
    };
    this.store.dispatch(updateTask({ task: updatedTask }));
    this.showToast('TOAST.TASK_UPDATED', 'success');
  } else {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date()
    };
    this.store.dispatch(addTask({ task: newTask }));
    this.showToast('TOAST.TASK_ADDED', 'success');
  }

  this.closeModal();
  this.selectedTask = null; 
}

addTask(task:{title:string, description?:string}){
  const newTask : Task = {
    id: crypto.randomUUID(),
    title: task.title,
    description: task.description,
    completed: false,
    createdAt: new Date()
  }
  this.store.dispatch(addTask({task: newTask}));
  // this.toastService.show('Task added successfully!', "success");

  this.translate.get('TOAST.TASK_ADDED').subscribe((msg: string) => {{
    this.toastService.show(msg, "success");
  }});
}

  toggleTask(id: string) {
    this.store.dispatch(toggleTaskCompletion({ id }));
  }

  deleteTask(id: string) {
    this.store.dispatch(deleteTask({ id }));
    this.translate.get('TOAST.TASK_DELETED').subscribe((msg: string) => {{

      this.toastService.show(msg, "error");
    }});
  }


    private showToast(key: string, type: 'success' | 'error' | 'info') {
    this.translate.get(key).subscribe(msg => {
      this.toastService.show(msg, type);
    });
  }
}
