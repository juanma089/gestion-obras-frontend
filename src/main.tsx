import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MaterialRequestsProvider } from './context/MaterialRequestsContext'; // 👈 Importa tu provider
import './index.css'
import { AuthProvider } from './context/AuthProvider.tsx';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MaterialRequestsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MaterialRequestsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
