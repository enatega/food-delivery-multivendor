/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGlobalProps {
  children?: React.ReactNode;
}
export interface IGlobalComponentProps extends IGlobalProps {
  className?: string;
}

export interface IGlobalProviderProps extends IGlobalProps {}

export interface ILazyQueryResult<T, V> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fetch: (variables?: V) => void; // for useLazyQuery
  isError: boolean;
  isSuccess: boolean;
}
export interface IQueryResult<T, V> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: (variables?: V) => void; // for useQuery
  isError: boolean;
  isSuccess: boolean;
}

export interface IError {
  message: string;
  statusCode: number;
}

// SVG
export interface ISVGComponentProps {
  className?: string;
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}

export interface ISVGRenderComponentProps {
  key: string;
  props: ISVGComponentProps;
}

//
