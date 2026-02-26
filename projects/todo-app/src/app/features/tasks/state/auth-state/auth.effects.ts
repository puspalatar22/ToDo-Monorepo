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
        private toastService: ToastService
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
          this.authService.saveSession(user);
           this.translate.get('LOGIN.SUCCESS').subscribe((msg: string) => {
        this.toastService.show(msg, 'success');
      });
          this.router.navigate(['/tasks']);
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.clearSession();

          // ✅ Only navigate if not already on login
          if (!this.router.url.includes('/login')) {
            this.router.navigate(['/login']);
          }
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
