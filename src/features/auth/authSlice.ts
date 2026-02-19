import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const loadAuthState = (): Partial<AuthState> => {
  if (typeof window === 'undefined') return {};
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('user');
  if (token && userStr) {
    try {
      return {
        token,
        user: JSON.parse(userStr),
        isAuthenticated: true,
      };
    } catch {
      return {};
    }
  }
  return {};
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  ...loadAuthState(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: { payload: { user: User; token: string } }) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
