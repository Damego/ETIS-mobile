import { useQuery } from '@tanstack/react-query';

import healthCheck from '~/api/psutech/healthCheck';

/**
 * Reactive psutech availability status.
 * Returns `null` while the check is still in flight.
 */
const usePsutechHealth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['psutech-health'],
    queryFn: () => healthCheck.check(),
    staleTime: Infinity,
    retry: false,
  });

  return {
    isChecking: isLoading,
    isDown: isLoading ? null : data === false,
  };
};

export default usePsutechHealth;
