import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskPageComponent } from './task-page/task-page.component';

const routes: Routes = [
  { path: '', component: TaskPageComponent }  // ✅ empty path = /tasks
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }