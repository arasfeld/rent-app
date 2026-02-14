import { useDispatch, useSelector } from 'react-redux';

import { api, useLoginMutation, useRegisterMutation } from './api';
import { logout as logoutAction } from './auth-slice';

import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isLoading } = useAppSelector((state) => state.auth);
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const login = async (email: string, password: string) => {
    await loginMutation({ email, password }).unwrap();
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    await registerMutation(data).unwrap();
  };

  const logout = () => {
    dispatch(logoutAction());
    dispatch(api.util.resetApiState());
  };

  return { user, token, isLoading, login, register, logout };
}
