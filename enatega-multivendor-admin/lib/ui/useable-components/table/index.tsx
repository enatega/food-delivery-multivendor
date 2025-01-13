// Interface and Types
import {
  IDataTableProps,
  ITableExtends,
} from '@/lib/utils/interfaces/table.interface';

// Prime React
import { Column } from 'primereact/column';
import {
  DataTable,
  DataTableSelectionMultipleChangeEvent,
} from 'primereact/datatable';
import DataTableColumnSkeleton from '../custom-skeletons/datatable.column.skeleton';
const Table = <T extends ITableExtends>({
  header,
  data,
  selectedData,
  setSelectedData,
  columns,
  filters,
  size = 'small',
  loading,
  isSelectable = false,
  moduleName = 'Restaurant-Orders',
  handleRowClick,
  rowsPerPage = 10,
}: IDataTableProps<T>) => {
  const handleSelectionChange = (
    e: DataTableSelectionMultipleChangeEvent<T[]>
  ) => {
    setSelectedData(e.value);
  };

  const rowClassName = (data: T) => {
    let className = '';
    switch (moduleName) {
      case 'Restaurant-Order':
        className = data?.orderStatus === 'ASSIGNED' ? 'row-assigned' : '';
        break;
      case 'SuperAdmin-Order':
        className = data?.orderStatus === 'ASSIGNED' ? 'row-assigned' : '';
        break;
      default:
        break;
    }
    return `${className} ${handleRowClick ? 'hover-clickable-row' : ''}`;
  };

  return (
    <>
      <DataTable
        header={header}
        paginator
        rows={rowsPerPage ? rowsPerPage : 10}
        rowsPerPageOptions={[10, 15, 25, 50]}
        value={data}
        size={size}
        selection={selectedData}
        onSelectionChange={handleSelectionChange}
        dataKey="_id"
        tableStyle={{
          minWidth: '50rem',
          minHeight: 'auto',
          maxHeight: '480px',
        }}
        selectionMode={isSelectable ? 'checkbox' : null}
        filters={filters}
        scrollable={true}
        scrollHeight="480px"
        removableSort
        rowClassName={rowClassName}
        onRowClick={handleRowClick}
      >
        {isSelectable && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
          ></Column>
        )}
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.propertyName}
            header={col.headerName}
            sortable={!col.propertyName.includes('action')}
            bodyClassName="selectable-column"
            body={loading ? <DataTableColumnSkeleton /> : col.body}
          />
        ))}
      </DataTable>
    </>
  );
};

export default Table;
