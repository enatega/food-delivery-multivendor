import { ApolloError } from '@apollo/client';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { TPolygonPoints } from '../types';

export interface IGlobalProps {
  children?: React.ReactNode;
}
export interface IGlobalComponentProps extends IGlobalProps {
  className?: string;
}
export interface IDropdownSelectItem {
  _id?: string;
  label?: string;
  code?: string;
  body?: () => void;
}
export interface IRiderDropDownSelectItem extends IDropdownSelectItem {
  assignedOrders: string[];
}
export interface QueryState {
  data: [];
  loading: boolean;
  error?: ApolloError;
}

export interface IGlobalButtonProps {
  Icon: IconDefinition;
  title: string;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

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

export interface IPaginationVars {
  page?: number;
  rows?: number;
}

export interface IPaginationCommissionRateVars {
  page?: number;
  limit?: number;
}

export interface ITableColumn<T> {
  field?: string;
  header?: string;
  body?: (data: T) => ReactNode;
}
export interface INotificationComponentProps {
  type: 'success' | 'error' | 'warn' | 'info';
  title: string;
  message: string;
}

/* Stepper */

export interface IStepperFormProps {
  order: number;
  isLastStep?: boolean;
  onStepChange: (order: number) => void;
}
export interface IEditState<T> {
  bool: boolean;
  data: T;
}

export interface IGlobalTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IPolygonLocation {
  coordinates: TPolygonPoints;
}
