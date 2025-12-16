import React, { useMemo } from 'react';
import {
  Paginator,
  PaginatorPageChangeEvent,
  PaginatorCurrentPageReportOptions,
  PaginatorFirstPageLinkOptions,
  PaginatorPrevPageLinkOptions,
  PaginatorNextPageLinkOptions,
  PaginatorLastPageLinkOptions,
  PaginatorRowsPerPageDropdownOptions,
  PaginatorChangeEvent,
} from 'primereact/paginator';
import { useTranslations } from 'next-intl';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CustomPaginatorProps {
  first: number;
  rows: number;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
  onPageChange: (event: PaginatorPageChangeEvent) => void;
  rowsPerPageOptions?: number[];
}

export default function CustomPaginator({
  first,
  rows,
  totalRecords,
  onPageChange,
  rowsPerPageOptions = [10, 15, 25, 50, 100],
}: CustomPaginatorProps) {
  const t = useTranslations();

  const paginatorTemplate = useMemo(() => {
    return {
      layout:
        'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',

      FirstPageLink: (options: PaginatorFirstPageLinkOptions) => (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </button>
      ),

      PrevPageLink: (options: PaginatorPrevPageLinkOptions) => (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      ),

      NextPageLink: (options: PaginatorNextPageLinkOptions) => (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      ),

      LastPageLink: (options: PaginatorLastPageLinkOptions) => (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
      ),

      RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => (
        <select
        
          className="p-dropdown p-component dark:bg-gray-950"
          value={String(options.value ?? '')}
          onChange={(e) => {
            const customEvent = {
              ...e,
              originalEvent: e,
              value: e.target.value || null,
            } as unknown as PaginatorChangeEvent;

            options.onChange(customEvent);
          }}
        >
          {options.options.map((opt) => (
            <option className='dark:bg-gray-950 ' key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ),




      CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => (
        <span className={options.className}>
          {t('Showing')} {options.first} {t('to')} {options.last} {t('of')}{' '}
          {options.totalRecords}
        </span>
      ),
    };
  }, [t]);

  return (
    <div className="border-b border-l border-r border-gray-200 dark:border-gray-800  bg-white dark:bg-gray-950 dark:text-white p-2">
      <Paginator
      className='dark:bg-gray-950 '
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template={paginatorTemplate}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </div>
  );
}
