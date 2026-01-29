'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { type ReactNode, useEffect, useState } from 'react';
import { WalletProvider } from '@/contexts/WalletContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 5 * 1000,
      retry: false,
    },
  },
});

export interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
          <>{isMounted ? children : <></>}</>
          <ReactQueryDevtools buttonPosition='bottom-left' initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </WalletProvider>
  );
}

export default Providers;
