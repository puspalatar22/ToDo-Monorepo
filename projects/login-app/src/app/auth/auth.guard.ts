import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'shared-services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authservice: AuthService,
    private router: Router,
  ) {}
canActivate(): boolean {
  const isLoggedIn = !!this.authservice.getSession();
  if (isLoggedIn) {
    // User is already logged in → redirect to todo-app tasks
    window.location.href = 'http://localhost:4200/tasks';
    return false; 
  }
  return true; 
}
}
