import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { api } from './api';

import type { User } from '@repo/shared';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.accessToken;
        state.isLoading = false;
        localStorage.setItem('token', payload.accessToken);
      }
    );
    // Register
    builder.addMatcher(
      api.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.accessToken;
        state.isLoading = false;
        localStorage.setItem('token', payload.accessToken);
      }
    );
    // Get Profile success
    builder.addMatcher(
      api.endpoints.getProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isLoading = false;
      }
    );
    // Get Profile failure
    builder.addMatcher(api.endpoints.getProfile.matchRejected, (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    });
  },
});

export const { logout, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
