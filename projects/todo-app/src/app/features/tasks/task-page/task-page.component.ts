import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormConfig, Task } from 'models';
import { Observable } from 'rxjs';
import { selectAllTasks } from '../state/task.selector';
import {
  addTask,
  loadTasks,
  toggleTaskCompletion,
  deleteTask,
  updateTask,
} from '../state/task.actions';
import { ToastService } from 'shared-services';
import { TranslateService } from '@ngx-translate/core';
import { Validators } from '@angular/forms';
import { logout } from '../state/auth-state/auth.actions';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss'],
})
export class TaskPageComponent implements OnInit {
  tasks$: Observable<Task[]> | undefined;
  currentLang = 'en';
  selectedTask: Task | null = null;
  showModal = false;
  showLogOutModal = false;

  todoFormConfig: FormConfig = {
    fields: [
      {
        name: 'title',
        type: 'text',
        translationKey: 'TASK_LIST.TITLE_PLACEHOLDER',
        validators: [Validators.required],
      },
      {
        name: 'description',
        type: 'textarea',
        translationKey: 'TASK_LIST.DESCRIPTION_PLACEHOLDER',
      },
    ],
    submitButtonKey: 'TASK_LIST.ADD_TASK',
  };

  constructor(
    private store: Store,
    @Inject(ToastService) private toastService: ToastService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.currentLang);
  }
  ngOnInit(): void {
    this.tasks$ = this.store.select(selectAllTasks);
    this.store.dispatch(loadTasks());
  }

  switchLanguage(lang: string) {
    // this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
    lang === 'en' ? 'hi' : 'en';
    this.currentLang = lang;
    this.translate.use(this.currentLang);
  }

  openAddModal() {
    this.selectedTask = null;
    this.todoFormConfig = {
      ...this.todoFormConfig,
      submitButtonKey: 'TASK_LIST.ADD_TASK',
    };
    this.showModal = true;
  }

  openEditModal(task: Task) {
    this.selectedTask = { ...task };
    this.todoFormConfig = {
      ...this.todoFormConfig,
      submitButtonKey: 'TASK_LIST.EDIT_TASK',
    };
    this.showModal = true;
  }

openLogoutModal() {
  this.showLogOutModal = true;
}

cancelLogout() {
  this.showLogOutModal = false;
}

confirmLogout() {
    console.log('Logout clicked'); 
  this.showLogOutModal = false;
  this.store.dispatch(logout());
}

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
  }

  handleSaveTask(formValue: Record<string, any>) {
    const title = formValue['title'] as string;
    const description = formValue['description'] as string | undefined;

    if (this.selectedTask) {
      const updatedTask: Task = {
        ...this.selectedTask,
        title,
        description,
      };
      this.store.dispatch(updateTask({ task: updatedTask }));
      this.showToast('TOAST.TASK_UPDATED', 'success');
    } else {
      const newTask: Task = {
        title,
        description,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date(),
      };
      this.store.dispatch(addTask({ task: newTask }));
      this.showToast('TOAST.TASK_ADDED', 'success');
    }

    this.closeModal();
  }

  toggleTask(id: string) {
    this.store.dispatch(toggleTaskCompletion({ id }));
  }

  deleteTask(id: string) {
    this.store.dispatch(deleteTask({ id }));
    this.showToast('TOAST.TASK_DELETED', 'error');
  }

  private showToast(key: string, type: 'success' | 'error' | 'info') {
    this.translate.get(key).subscribe((msg: string) => {
      this.toastService.show(msg, type);
    });
  }
}
