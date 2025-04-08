import moment from "moment";
import {
  ApolloQueryResult,
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  QueryResult,
} from "@apollo/client";

export const retryQuery = async <
  T extends DocumentNode,
  V extends OperationVariables | LazyQueryHookOptions,
>(
  queryFn: () => Promise<QueryResult<T, V> | ApolloQueryResult<T>>, // Function to execute the query
  retries: number, // Number of retries
  delayMs: number, // Delay between retries
): Promise<QueryResult<T, V> | ApolloQueryResult<T>> => {
  let attempt = 0;

  const retry = async (): Promise<QueryResult<T, V> | ApolloQueryResult<T>> => {
    try {
      return await queryFn(); // Try executing the query
    } catch (error) {
      if (attempt < retries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delayMs)); // Wait before retry
        return retry(); // Retry the query
      } else {
        throw error; // Throw error if retries exhausted
      }
    }
  };

  return retry(); // Initial call to retry function
};

export const getIsAcceptButtonVisible = (orderDate: string) => {
  const mockCurrentTime = moment().add(5, "minutes"); // Add 5 minutes as a grace period
  return !mockCurrentTime.isBefore(orderDate);
};
