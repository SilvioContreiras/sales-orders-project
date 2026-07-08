import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { setupStore } from '@/app/store';
import { createQueryClient } from '@/shared/api/queryClient';

/** Renders a component wrapped with the Redux store and a fresh Query client. */
export function renderWithProviders(ui: ReactElement) {
  const store = setupStore();
  const queryClient = createQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ReduxProvider>
    );
  }

  return { store, queryClient, ...render(ui, { wrapper: Wrapper }) };
}
