'use client';

import { useFetchReferralLoyaltyHistoryQuery } from '@/lib/graphql-generated';
import Table from '@/lib/ui/useable-components/table';
import { toTextCase } from '@/lib/utils/methods';
import { useMemo, useState } from 'react';
import type { JSX } from 'react';

interface HistoryRow {
  _id: string;
  user_name: string;
  user_rank: string;
  type: string;
  level: number;
  value: number;
  createdAt: string;
}

interface TableColumn {
  propertyName: string;
  headerName: string;
  body?: (rowData: HistoryRow) => JSX.Element;
  hidden?: boolean;
}

export default function LoyaltyAndReferralHistoryComponent() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API
  const { data, loading, refetch } = useFetchReferralLoyaltyHistoryQuery({
    variables: {
      filter: {
        page: currentPage,
        limit: rowsPerPage,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  
  // Process data for table
  const tableData = useMemo(() => {
    const logs = data?.fetchReferralLoyaltyHistory?.data || [];
    return logs.filter(Boolean) as HistoryRow[];
  }, [data]);

  // Pagination handler
  const handlePageChange = (page: number, rows: number) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
    refetch({
      filter: {
        page,
        limit: rows,
      },
    });
  };

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      propertyName: 'user_name',
      headerName: 'Customer Name',
      body: (rowData: HistoryRow) => (
        <span className="text-foreground dark:text-white text-sm">{rowData.user_name}</span>
      ),
    },
    {
      propertyName: 'user_rank',
      headerName: 'Rank',
      body: (rowData: HistoryRow) => (
        <span className="text-foreground dark:text-white text-sm font-medium">
          {toTextCase(rowData.user_rank, 'title')}
        </span>
      ),
    },
    {
      propertyName: 'value',
      headerName: 'Total Points',
      body: (rowData: HistoryRow) => (
        <span className="text-foreground dark:text-white text-sm font-medium">{rowData.value}</span>
      ),
    },
    {
      propertyName: 'type',
      headerName: 'Type',
      body: (rowData: HistoryRow) => (
        <span className="text-foreground dark:text-white text-sm font-medium">{rowData.type}</span>
      ),
    },
    {
      propertyName: 'level',
      headerName: 'Tier',
      body: (rowData: HistoryRow) => (
        <span className="text-foreground dark:text-white text-sm font-medium">Level {rowData.level}</span>
      ),
    },
    {
      propertyName: 'createdAt',
      headerName: 'Last Purchase',
      body: (rowData: HistoryRow) => (
        <span className="text-foreground dark:text-white text-sm font-medium">
          {new Date(parseInt(rowData.createdAt)).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="m-3 p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Referral and Loyalty History
          </h2>
          <p className="text-muted-foreground text-sm">
            Customer loyalty and referral activity history.
          </p>
        </div>
      </div>

      <Table
        data={tableData}
        columns={columns}
        loading={loading}
        rowsPerPage={rowsPerPage}
        className="loyalty-history-table"
        totalRecords={data?.fetchReferralLoyaltyHistory?.totalCount}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
}
