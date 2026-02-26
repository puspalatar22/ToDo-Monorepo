import { createAction, props } from "@ngrx/store";
import { AuthUser } from "models";

// Login Actions
export const login = createAction('[Auth] Login', props<{email: string, password: string}>());
export const loginSuccess = createAction('[Auth] Login Success', props<{user: AuthUser}>());
export const loginFailure = createAction('[Auth] Login Failure', props<{error: string}>());

// Logout Actions
export const logout = createAction('[Auth] Logout');

// Restore Session Actions
export const restoreSession = createAction('[Auth] Restore Session');
export const restoreSessionSuccess = createAction('[Auth] Restore session Success', props<{user: AuthUser}>());
export const restoreSessionFailure = createAction('[Auth] Restore session Failure');