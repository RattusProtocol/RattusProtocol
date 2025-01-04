import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export function useCryptoData() {
  const { data, error, isLoading } = useSWR('/api/crypto', fetcher, {
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  return {
    cryptoData: data,
    isLoading,
    isError: error
  };
} 