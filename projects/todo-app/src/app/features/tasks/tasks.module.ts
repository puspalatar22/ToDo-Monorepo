import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from 'projects/ui-components/src/public-api';

import { TasksRoutingModule } from './tasks-routing.module';
import { TaskPageComponent } from './task-page/task-page.component';
import { taskReducer } from './state/task.reducer';
import { TaskEffects } from './state/task.effects';
import { ChatbotComponent } from './chatbot/chatbot.component';

@NgModule({
  declarations: [
    TaskPageComponent,
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    UiComponentsModule,
    TasksRoutingModule,  
    StoreModule.forFeature('tasks', taskReducer),
    EffectsModule.forFeature([TaskEffects]),
  ]
})
export class TasksModule { }