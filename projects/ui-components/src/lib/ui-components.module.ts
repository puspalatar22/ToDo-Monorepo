import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TodoButtonComponent } from './todo-button/todo-button.component';
import { TodoInputComponent } from './todo-input/todo-input.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    TodoItemComponent,
    TodoFormComponent,
    TodoButtonComponent,
    TodoInputComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    TodoItemComponent,
    TodoFormComponent,
    TodoButtonComponent,
    TodoInputComponent,
    ToastComponent,
    TranslateModule
  ]
})
export class UiComponentsModule {}