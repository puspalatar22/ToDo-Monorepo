import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TodoButtonComponent } from './todo-button/todo-button.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    TodoFormComponent,
    TodoButtonComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    TodoFormComponent,
    TodoButtonComponent,
    ToastComponent,
    TranslateModule
  ]
})
export class UiComponentsModule {}