import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { AuthService, ToastService } from 'shared-services';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  restoreSession,
  restoreSessionFailure,
  restoreSessionSuccess,
} from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    @Inject(AuthService) private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((user) => loginSuccess({ user })),
          catchError((err) =>
            of(loginFailure({ error: err.message || 'Login failed' })),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ user }) => {
          // Save session in login-app localStorage
          this.authService.saveSession(user);

          // Show success toast
          this.translate.get('LOGIN.SUCCESS').subscribe((msg: string) => {
            this.toastService.show(msg, 'success');
          });
          document.cookie = 'isLoggedIn=true; path=/';
          window.location.href = 'http://localhost:5000/tasks';
        }),
      ),
    { dispatch: false },
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(restoreSession),
      map(() => {
        const user = this.authService.getSession();
        return user ? restoreSessionSuccess({ user }) : restoreSessionFailure();
      }),
    ),
  );
}
