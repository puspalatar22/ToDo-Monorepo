import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  canActivate(): boolean {

    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('isLoggedIn='));

    if (authCookie && authCookie.includes('true')) {
      return true;
    }

    window.location.href = 'http://localhost:61875/login';
    return false;
  }
}