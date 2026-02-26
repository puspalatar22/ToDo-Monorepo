import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from 'projects/ui-components/src/public-api';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { authReducer } from '../features/tasks/state/auth-state/auth.reducer';
import { AuthEffects } from '../features/tasks/state/auth-state/auth.effects';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    UiComponentsModule,
    AuthRoutingModule,

    StoreModule.forFeature('auth', authReducer),   
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class AuthModule { }