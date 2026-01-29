'use client';

// Core
import { useMutation } from '@apollo/client';
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import {
  IRiderResponse,
  IRidersDataResponse,
  IRidersMainComponentsProps,
} from '@/lib/utils/interfaces/rider.interface';

// UI Components
import RidersTableHeader from '../header/table-header';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import RejectionReasonModal from '@/lib/ui/useable-components/rejection-reason-modal';
import Table from '@/lib/ui/useable-components/table';
import { RIDER_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/rider-columns';

// Utilities and Data
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

// GraphQL and Utilities
import { DELETE_RIDER, GET_RIDERS, REJECT_RIDER_REQUEST } from '@/lib/api/graphql';
import { IQueryResult } from '@/lib/utils/interfaces';

// Data
import { generateDummyRiders } from '@/lib/utils/dummy';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function RidersMain({
  setIsAddRiderVisible,
  setRider,
}: IRidersMainComponentsProps) {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();
  const router = useRouter();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IRiderResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [riderToReject, setRiderToReject] = useState<IRiderResponse | null>(null);

  // Query
  const { data, loading } = useQueryGQL(GET_RIDERS, {}) as IQueryResult<
    IRidersDataResponse | undefined,
    undefined
  >;

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_RIDER,
    {
      refetchQueries: [{ query: GET_RIDERS }],
    }
  );

  const [mutateReject, { loading: rejectLoading }] = useMutation(REJECT_RIDER_REQUEST, {
    refetchQueries: [{ query: GET_RIDERS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Success'),
        message: t('Rider request rejected successfully'),
        duration: 3000,
      });
      setRejectionModalVisible(false);
      setRiderToReject(null);
    },
    onError: () => {
      showToast({
        type: 'error',
        title: t('Error'),
        message: t('Failed to reject rider request'),
        duration: 3000,
      });
      setRejectionModalVisible(false);
      setRiderToReject(null);
    },
  });

  // Handle rejection with reason
  const handleRejectWithReason = (rejectionReason: string) => {
    if (riderToReject) {
      mutateReject({ 
        variables: { 
          id: riderToReject._id, 
          reason: rejectionReason 
        } 
      });
    }
  };

  // Handle rider rejection
  const handleRiderRejection = (rider: IRiderResponse) => {
    setRiderToReject(rider);
    setRejectionModalVisible(true);
  };

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const menuItems: IActionMenuItem<IRiderResponse>[] = [
    {
      label: t('View'),
      command: (data?: IRiderResponse) => {
        if (data) {
          router.push(`/general/riders/${data._id}`);
        }
      },
    },
    {
      label: t('Edit'),
      command: (data?: IRiderResponse) => {
        if (data) {
          setIsAddRiderVisible(true);
          setRider(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IRiderResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  // Sort riders: PENDING first (latest first), then ACCEPTED, then REJECTED
  const sortedRiders = data?.riders ? [...data.riders].sort((a, b) => {
    // First sort by status priority
    const statusOrder = { 'PENDING': 0, 'ACCEPTED': 1, 'REJECTED': 2 };
    const statusComparison = statusOrder[a.riderRequestStatus] - statusOrder[b.riderRequestStatus];
    
    if (statusComparison !== 0) return statusComparison;
    
    // Within same status, sort by creation date (latest first)
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    return 0;
  }) : [];

  const riderTableColumns = RIDER_TABLE_COLUMNS({ 
    menuItems,
    onRejectRider: handleRiderRejection 
  });

  return (
    <div className="p-3">
      <Table
        header={
          <RidersTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={sortedRiders.length > 0 ? sortedRiders : (loading ? generateDummyRiders() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={riderTableColumns}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          mutateDelete({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Success'),
                message: t('Rider Deleted'),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this item?')}
      />
      
      <RejectionReasonModal
        visible={rejectionModalVisible}
        onHide={() => {
          setRejectionModalVisible(false);
          setRiderToReject(null);
        }}
        onConfirm={handleRejectWithReason}
        loading={rejectLoading}
      />
    </div>
  );
}
