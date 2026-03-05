import { createReducer, on } from '@ngrx/store';
import { AuthState } from 'models';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  restoreSession,
  restoreSessionFailure,
  restoreSessionSuccess,
} from './auth.actions';

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: true,
    loading: false,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(restoreSession, (state) => ({
    ...state,
    loading: true,
  })),

  on(restoreSessionSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: true,
    loading: false,
    error: null,
  })),
  on(restoreSessionFailure, () => ({ ...initialAuthState })),
  on(logout, () => ({ ...initialAuthState }))
);
