import { FilterMatchMode } from 'primereact/api';
import { IGlobalComponentProps } from './global.interface';
import { DataTableRowClickEvent, DataTableStateEvent, SortOrder } from 'primereact/datatable';

export interface IFilterType {
  [key: string]: {
    value: string | string[] | null | boolean | boolean[];
    matchMode: FilterMatchMode;
  };
}

export interface IColumnConfig<T> extends IGlobalComponentProps {
  headerName?: string;
  propertyName: string;
  body?: (rowData: T) => React.ReactNode;
}

export interface IDataTableProps<T> extends IGlobalComponentProps {
  isSelectable?: boolean;
  header?: React.ReactNode;
  data: T[];
  selectedData: T[];
  setSelectedData: React.Dispatch<React.SetStateAction<T[]>>;
  columns: IColumnConfig<T>[];
  filters?: IFilterType;
  size?: 'small' | 'normal' | 'large';
  loading?: boolean;
  handleRowClick?: (event: DataTableRowClickEvent) => void;
  rowsPerPage?: number;
  moduleName?: string;
  totalRecords?: number;
  onPageChange?: (page: number, rows: number) => void;
  currentPage?: number;
  onPage?: (e: DataTableStateEvent) => void;
  scrollable?: boolean;
  scrollHeight?: string;
  sortField?:string;
  sortOrder?:SortOrder
}

export interface ITableExtends extends IGlobalComponentProps {
  orderStatus?: string;
  _id: number | string;
}
