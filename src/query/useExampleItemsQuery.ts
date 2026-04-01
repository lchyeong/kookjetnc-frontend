import { useQuery } from '@tanstack/react-query';

import { fetchExampleItems } from '@/api/exampleItems';

export const exampleItemsQueryKey = ['exampleItems'] as const;

export const useExampleItemsQuery = () => {
  return useQuery({
    queryKey: exampleItemsQueryKey,
    queryFn: fetchExampleItems,
  });
};
