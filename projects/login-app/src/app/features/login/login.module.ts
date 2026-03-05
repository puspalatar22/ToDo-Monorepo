import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './state/auth.reducer';
import { AuthEffects } from './state/auth.effects';
import { TranslateModule } from '@ngx-translate/core';
import { UiComponentsModule } from 'ui-components';
import { SharedI18nModule } from 'shared-i18n';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    UiComponentsModule,
    TranslateModule, 
    SharedI18nModule,                   // for pipes and directives
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class LoginModule {}