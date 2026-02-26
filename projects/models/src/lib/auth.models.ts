export interface AuthUser{
    id: string;
    email: string;
    token: string;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isLoggedIn: boolean;
}