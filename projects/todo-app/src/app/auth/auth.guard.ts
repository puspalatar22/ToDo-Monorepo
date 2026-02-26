import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { filter, map, Observable, take } from "rxjs";
import { selectIsLoggedIn } from "../features/tasks/state/auth-state/auth.selector";

@Injectable({providedIn: 'root'})

export class AuthGuard  implements CanActivate{

    constructor(private store: Store, private router: Router){}

canActivate(): Observable<boolean | UrlTree> {
  return this.store.select(selectIsLoggedIn).pipe(
    take(1),
    map(isLoggedIn => isLoggedIn ? true : this.router.createUrlTree(['/login']))
  );
}

}