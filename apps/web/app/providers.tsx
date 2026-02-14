'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { TooltipProvider } from '@repo/ui';
import { makeStore, type AppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { setLoading, setToken } from '@/lib/auth-slice';

export function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const initialized = useRef(false);
  if (!initialized.current && typeof window !== 'undefined') {
    initialized.current = true;
    const token = localStorage.getItem('token');
    if (token) {
      storeRef.current.dispatch(setToken(token));
      storeRef.current.dispatch(api.endpoints.getProfile.initiate());
    } else {
      storeRef.current.dispatch(setLoading(false));
    }
  }

  return (
    <Provider store={storeRef.current}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TooltipProvider>{children}</TooltipProvider>
      </NextThemesProvider>
    </Provider>
  );
}
