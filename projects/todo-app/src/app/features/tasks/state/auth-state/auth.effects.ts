import { Injectable, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { AuthService } from "shared-services";
import { login, loginFailure, loginSuccess, logout, restoreSession, restoreSessionFailure, restoreSessionSuccess } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";

@Injectable()

export class AuthEffects {
    constructor( private actions$: Actions, @Inject(AuthService) private authService: AuthService, private router: Router){}


    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(({email, password}) => this.authService.login(email, password).pipe(
            map((user) => loginSuccess({user})),
            catchError((err)=> of(loginFailure({error: err.message || 'Login failed'})))
        )
    )));

    loginSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(loginSuccess),
        tap(({user})=> {
            this.authService.saveSession(user);
            this.router.navigate(['/tasks']);
        })
    ),{ dispatch: false});

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout),
        tap(()=> {
            this.authService.clearSession();
            this.router.navigate(['/login'])
        })
    ));

    restoreSession$ = createEffect(()=> this.actions$.pipe(
        ofType(restoreSession),
        map(()=> {
            const user = this.authService.getSession();
            return user ? restoreSessionSuccess({user}) : restoreSessionFailure();
        })
    ));
}