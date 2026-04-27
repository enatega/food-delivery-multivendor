import { FilterMatchMode } from 'primereact/api';
import { IGlobalComponentProps } from './global.interface';
import {
  DataTableRowClickEvent,
  DataTableStateEvent,
  DataTableFilterMeta,
  SortOrder,
} from 'primereact/datatable';

export interface IFilterType {
  [key: string]: {
    value: string | string[] | null | boolean | boolean[];
    matchMode: FilterMatchMode;
  };
}

export interface IColumnConfig<T> extends IGlobalComponentProps {
  hidden?: boolean;
  headerName?: string;
  propertyName: string;
  body?: (rowData: T) => React.ReactNode;
}

export interface IDataTableProps<T> extends IGlobalComponentProps {
  isSelectable?: boolean;
  header?: React.ReactNode;
  data: T[];
  selectedData?: T[];
  setSelectedData?: React.Dispatch<React.SetStateAction<T[]>>;
  columns: IColumnConfig<T>[];
  filters?: DataTableFilterMeta;
  size?: 'small' | 'normal' | 'large';
  loading?: boolean;
  handleRowClick?: (event: DataTableRowClickEvent) => void;
  rowsPerPage?: number;
  moduleName?: string;
  globalFilterFields?: string[];

  // Server-side pagination props (optional)
  totalRecords?: number;
  onPageChange?: (page: number, rows: number) => void;
  currentPage?: number;

  // Legacy/unused props
  onPage?: (e: DataTableStateEvent) => void;
  scrollable?: boolean;
  scrollHeight?: string;
  sortField?: string;
  sortOrder?: SortOrder;
  minWidth?: string;
  paginator?: boolean;
  first?: number;
  rows?: number;
}

export interface ITableExtends extends IGlobalComponentProps {
  orderStatus?: string;
  _id: number | string;
}
