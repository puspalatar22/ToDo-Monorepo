import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TASK_FEATURE_KEY } from './state/task.state';
import { taskReducer } from './state/task.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TaskEffects } from './state/task.effects';
import { UiComponentsModule } from 'ui-components';
import { TaskPageComponent } from './task-page/task-page.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TaskPageComponent
  ],
  imports: [
    CommonModule,
    UiComponentsModule,
    TranslateModule,
    StoreModule.forFeature(TASK_FEATURE_KEY, taskReducer),
    EffectsModule.forFeature([TaskEffects])
  ]
})
export class TasksModule { }
