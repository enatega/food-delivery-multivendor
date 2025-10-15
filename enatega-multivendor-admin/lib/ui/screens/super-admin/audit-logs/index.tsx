'use client';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUDIT_LOGS } from '@/lib/api/graphql/queries/audit';
import AuditLogCard, { AuditLog } from '@/lib/ui/screen-components/protected/super-admin/audit-logs/AuditLogCard';
import HeaderText from '@/lib/ui/useable-components/header-text';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { Card } from 'primereact/card';

const AuditLogScreen = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, loading, error } = useQuery(GET_AUDIT_LOGS, {
        variables: { page: currentPage, limit },
        fetchPolicy: 'cache-and-network',
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setCurrentPage(event.page + 1);
        setLimit(event.rows);
    };

    if (loading && !data) {
        return (
            <div className="p-4 md:p-6">
                <HeaderText text="Audit Logs" />
                <div className="mt-6">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} height="8rem" className="mb-4" />)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-6">
                <Card title="Error Loading Audit Logs" className="shadow-md border border-red-300 bg-red-50 text-red-800">
                    <p className="mb-3">We encountered an issue while trying to fetch the audit logs.</p>
                    <p className="font-semibold">Details: {error.message}</p>
                </Card>
            </div>
        );
    }

    const auditLogs = data?.auditLogs?.auditLogs || [];
    const totalRecords = data?.auditLogs?.totalCount || 0;

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <HeaderText text="Audit Logs" />
                <p className="text-gray-500 mt-1">Track all administrative actions and changes within the system.</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="h-[calc(100vh-280px)] overflow-y-auto pr-2">
                    {auditLogs.length > 0 ? (
                        <div className="relative">
                            {auditLogs.map((log: AuditLog, index: number) => (
                                <AuditLogCard key={log._id} log={log} isLast={index === auditLogs.length - 1} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Card>
                                <p>No audit logs found.</p>
                            </Card>
                        </div>
                    )}
                </div>

                {totalRecords > 0 && (
                    <div className="flex justify-center pt-4 border-t border-gray-200">
                        <Paginator
                            first={(currentPage - 1) * limit}
                            rows={limit}
                            totalRecords={totalRecords}
                            rowsPerPageOptions={[10, 20, 30]}
                            onPageChange={onPageChange}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogScreen;
