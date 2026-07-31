import {
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  useLazyQuery,
} from '@apollo/client';
import { WatchQueryFetchPolicy } from '@apollo/client/core/watchQueryOptions';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { retryQuery } from '../utils/methods';

export const useLazyQueryQL = <
  T extends DocumentNode,
  V extends OperationVariables | LazyQueryHookOptions,
>(
  query: DocumentNode,
  options: {
    enabled?: boolean;
    debounceMs?: number;
    pollInterval?: number;
    fetchPolicy?: WatchQueryFetchPolicy;
    retry?: number;
    retryDelayMs?: number;
    onCompleted?: (data: NoInfer<T>) => void;
  } = {},
  variables?: V
) => {
  const {
    enabled = true,
    debounceMs = 500,
    pollInterval,
    fetchPolicy,
    retry = 3, // Default retry count
    retryDelayMs = 1000, // Default retry delay,
    onCompleted,
  } = options;
  const [fetch, { data, error, loading }] = useLazyQuery<T, V>(query, {
    variables,
    fetchPolicy,
    pollInterval,
    onCompleted,
  });

  const debouncedFetch = useCallback(
    debounce(async (variables?: V) => {
      return await retryQuery(() => fetch({ variables }), retry, retryDelayMs);
    }, debounceMs),
    [fetch, debounceMs, retry, retryDelayMs]
  );

  const handleFetch = async (variables?: V) => {
    if (enabled) {
      await debouncedFetch(variables); // Ensure the async debounced fetch is awaited
    }
  };

  return {
    data,
    error,
    loading,
    fetch: handleFetch,
    isError: !!error,
    isSuccess: !!data,
  };
};
