export type ColumnConfig<T> = {
  propertyName: string;
  headerName: string;
  body?: (rowData: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  selectedData: T[];
  setSelectedData: React.Dispatch<React.SetStateAction<T[]>>;
  columns: ColumnConfig<T>[];
};

export const columns = [
  {
    headerName: 'ID',
    propertyName: 'id',
  },
  {
    headerName: 'Name',
    propertyName: 'name',
  },
  {
    headerName: 'Email',
    propertyName: 'email',
  },
  {
    headerName: 'Password',
    propertyName: 'password',
  },
  {
    headerName: 'Phone',
    propertyName: 'phone',
  },
  {
    headerName: 'Zone',
    propertyName: 'zone',
  },
  {
    headerName: 'Available',
    propertyName: 'available',
    // body: toggleComponent,
  },
  {
    headerName: '',
    propertyName: 'available',
  },
];
