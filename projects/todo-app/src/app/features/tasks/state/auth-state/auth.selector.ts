import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "models";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(selectAuthState, (s)=> s.user);
export const selectAuthLoading = createSelector(selectAuthState, (s)=>s.loading);
export const selectAuthError = createSelector(selectAuthState, (s)=>s.error);
export const selectIsLoggedIn = createSelector(selectAuthState, (s) => s.isLoggedIn);
export const selectAuthToken = createSelector(selectAuthState, (s) => s.user?.token ?? null);