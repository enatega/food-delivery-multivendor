
import { ApolloError } from '@apollo/client';
export const onErrorMessageMatcher = <T extends string>(
  type: T | undefined,
  message: string | undefined | string[],
  errorMessages: Record<T, string[]>
): boolean => {
  if (!type) return true;
  return errorMessages[type]?.some((emessage) => emessage === message) ?? false;
};




// Update input type to allow 'Error'
export const getGraphQLErrorMessage = (error: ApolloError | Error | undefined | null): string | null => {
  if (!error) return null;
  const isApolloError = (err: any): err is ApolloError => {
      return 'graphQLErrors' in err || 'networkError' in err;
  };

  if (isApolloError(error)) {
      if (error.networkError) {
        return 'Connection failed. Please check your internet connection.';
      }
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        return error.graphQLErrors.map((e) => e.message).join(', ');
      }
      return error.message?.replace(/^GraphQL error: /, '') || 'An unexpected error occurred.';
  }

  return error.message || 'An unexpected error occurred.';
};