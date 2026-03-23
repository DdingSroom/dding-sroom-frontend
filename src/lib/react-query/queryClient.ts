import { QueryCache, MutationCache, QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // TODO: handleApiError 연결 예정 (toast, redirect 등)
        console.error(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        // TODO: handleApiError 연결 예정 (toast, redirect 등)
        console.error(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,

        gcTime: 5 * 60 * 1000,

        retry: 1,

        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
