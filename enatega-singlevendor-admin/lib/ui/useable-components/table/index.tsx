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
  DataTablePageEvent,
} from 'primereact/datatable';
import DataTableColumnSkeleton from '../custom-skeletons/datatable.column.skeleton';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

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
  className,
  scrollable = true,
  scrollHeight = '420px',
  // Server-side pagination props
  totalRecords,
  onPageChange,
  currentPage = 1,
  minWidth,
}: IDataTableProps<T>) => {
  const handleSelectionChange = (
    e: DataTableSelectionMultipleChangeEvent<T[]>
  ) => {
    if (setSelectedData) {
      setSelectedData(e.value);
    }
  };

  // Hooks
  const t = useTranslations();

  // Handlers
  const handlePageChange = (event: DataTablePageEvent) => {
    if (onPageChange) {
      // Calculate page number (PrimeReact uses 0-based indexing for first)
      const page = Math.floor(event.first / event.rows) + 1;
      onPageChange(page, event.rows);
    }
  };

  const isServerPaginated = Boolean(onPageChange && totalRecords !== undefined);

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

  // Prepare pagination props based on server pagination status
  const paginationProps = isServerPaginated
    ? {
        lazy: true,
        first: (currentPage - 1) * rowsPerPage,
        totalRecords: totalRecords,
        onPage: handlePageChange,
      }
    : {};

  useEffect(() => {
    if (data?.length === 0 && currentPage > 1 && onPageChange) {
      onPageChange(1, rowsPerPage);
    }
  }, [data, currentPage, onPageChange, rowsPerPage]);

  return (
    <>
      {loading && data?.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="h-12 w-12 animate-spin text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t('Loading data...')}
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          header={header}
          paginator
          rows={rowsPerPage}
          rowsPerPageOptions={[10, 15, 25, 50]}
          value={data}
          selectionAutoFocus={true}
          size={size}
          selection={isSelectable ? selectedData || [] : []}
          onSelectionChange={isSelectable ? handleSelectionChange : undefined}
          className={className}
          dataKey="_id"
          tableStyle={{
            minWidth: minWidth ? minWidth : '50rem',
            minHeight: 'auto',
            maxHeight: '480px',
          }}
          selectionMode={isSelectable ? 'checkbox' : null}
          filters={filters}
          scrollable={scrollable}
          scrollHeight={scrollHeight}
          removableSort
          rowClassName={rowClassName}
          onRowClick={handleRowClick}
          emptyMessage={t('No Data Available')}
          {...paginationProps}
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
              className="dark:text-white"
              headerClassName="dark:text-white dark:bg-dark-900"
              footerClassName="dark:text-white dark:bg-dark-900"
              sortable={!col.propertyName.includes('action')}
              hidden={col.hidden}
              bodyClassName="selectable-column"
              body={loading ? <DataTableColumnSkeleton /> : col.body}
            />
          ))}
        </DataTable>
      )}
    </>
  );
};

export default Table;
