import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormConfig } from 'models';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'shared-services';
import { login } from '../../features/tasks/state/auth-state/auth.actions';
import { selectAuthError, selectIsLoggedIn } from '../../features/tasks/state/auth-state/auth.selector';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
  currentLang = 'en';

  loginFormConfig: FormConfig = {
    fields: [
      {
        name: 'email',
        type: 'email',
        translationKey: 'LOGIN.EMAIL_PLACEHOLDER',
        validators: [Validators.required, Validators.email]
      },
      {
        name: 'password',
        type: 'password',
        translationKey: 'LOGIN.PASSWORD_PLACEHOLDER',
        validators: [Validators.required, Validators.minLength(6)]
      }
    ],
    submitButtonKey: 'LOGIN.SUBMIT',
    resetOnSubmit: false
  };

  constructor(
    private store: Store,
    private router: Router,
    private translate: TranslateService,
    @Inject(ToastService) private toastService: ToastService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.currentLang);
  }

    ngOnInit() {
    // Show error toast when login fails
    this.store.select(selectAuthError).pipe(
      filter(Boolean),                  
      takeUntil(this.destroy$)
    ).subscribe((error) => {
      this.translate.get('LOGIN.ERROR').subscribe((msg: string) => {
        this.toastService.show(msg, 'error'); 
      });
    });
  }


  switchLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.translate.use(this.currentLang);
  }

    ngOnDestroy() {
    this.destroy$.next();    
    this.destroy$.complete();
  }

  handleLogin(formValue: Record<string, any>) {
    const email    = formValue['email']    as string;
    const password = formValue['password'] as string;

    this.store.dispatch(login({ email, password }));
  }
}