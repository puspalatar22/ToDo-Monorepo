import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormConfig } from 'models';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'shared-services';
import { login } from '../../state/auth.actions';
import { selectAuthError } from '../../state/auth.selector';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LanguageService } from 'shared-i18n';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentLang!: string;

  loginFormConfig: FormConfig = {
    fields: [
      {
        name: 'email',
        type: 'email',
        translationKey: 'LOGIN.EMAIL_PLACEHOLDER',
        validators: [Validators.required, Validators.email],
      },
      {
        name: 'password',
        type: 'password',
        translationKey: 'LOGIN.PASSWORD_PLACEHOLDER',
        validators: [Validators.required, Validators.minLength(6)],
      },
    ],
    submitButtonKey: 'LOGIN.SUBMIT',
    resetOnSubmit: false,
  };

  constructor(
    private store: Store,
    private translate: TranslateService,
    private toastService: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    // Initialize current language
    this.currentLang = this.languageService.currentLang();

    // Show error toast when login fails
    this.store
      .select(selectAuthError)
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((error) => {
        this.translate.get('LOGIN.ERROR').subscribe((msg: string) => {
          this.toastService.show(msg, 'error');
        });
      });
  }

  /**
   * Toggle language between 'en' and 'hi'
   */
  switchLanguage(): void {
    const newLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.languageService.switchLanguage(newLang);
    this.currentLang = newLang;
  }

  /**
   * Dispatch login action with form values
   */
  handleLogin(formValue: Record<string, any>): void {
    const email = formValue['email'] as string;
    const password = formValue['password'] as string;

    this.store.dispatch(login({ email, password }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}