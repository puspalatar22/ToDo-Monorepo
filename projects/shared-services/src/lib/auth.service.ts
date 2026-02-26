import { Injectable } from "@angular/core";
import { error } from "console";
import { AuthUser } from "models";
import { delay, of, throwError } from "rxjs";

const MOCK_USERS = [
  { email: 'admin@test.com', password: 'admin123', id: '1', token: 'mock-token-admin' },
  { email: 'user@test.com',  password: 'user123',  id: '2', token: 'mock-token-user'  },
];
@Injectable({ providedIn: 'root'})

export class AuthService {

    private readonly USER_KEY = 'auth_user';

// Login
    login(email: string, password: string){
        const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);

        if(matchedUser){
            const user : AuthUser = {
                id: matchedUser.id,
                email: matchedUser.email,
                token: matchedUser.token}
                return of(user).pipe(delay(500));
        }

        return throwError(() => ({ error: {message : 'Invalid email or password'}})).pipe(delay(500));
    }

    // Session management
    saveSession(user: AuthUser){
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    getSession(): AuthUser | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) as AuthUser : null;
    }

    clearSession(){
        localStorage.removeItem(this.USER_KEY);
    }

}