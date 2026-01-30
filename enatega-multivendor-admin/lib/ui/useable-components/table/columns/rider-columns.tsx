// Core
import { useContext, useState } from 'react';

// Custom Components
import ActionMenu from '@/lib/ui/useable-components/action-menu';
import CustomInputSwitch from '../../custom-input-switch';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

// Interfaces and Types
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { IRiderResponse } from '@/lib/utils/interfaces/rider.interface';
import { IDropdownSelectItem } from '@/lib/utils/interfaces';

// GraphQL
import { GET_RIDERS, TOGGLE_RIDER, ACCEPT_RIDER_REQUEST } from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import { ToastContext } from '@/lib/context/global/toast.context';
import { useTranslations } from 'next-intl';
import { toTextCase } from '@/lib/utils/methods';

export const RIDER_TABLE_COLUMNS = ({
  menuItems,
  onRejectRider,
}: {
  menuItems: IActionMenuProps<IRiderResponse>['items'];
  onRejectRider?: (rider: IRiderResponse) => void;
}) => {
  // Hooks
  const t = useTranslations();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState<{
    id: string;
    isActive: boolean;
  }>({ id: '', isActive: false });

  const { showToast } = useContext(ToastContext);

  // Status options (only for dropdown - excluding PENDING)
  const statusOptions = [
    { 
      label: t('Accept'), 
      code: 'ACCEPTED',
      severity: 'success' as const
    },
    { 
      label: t('Reject'), 
      code: 'REJECTED',
      severity: 'danger' as const
    }
  ];

  // Status templates
  const itemTemplate = (option: IDropdownSelectItem) => (
    <div className="flex items-center justify-start gap-2">
      <Tag
        severity={option.severity}
        value={option.label}
        rounded
      />
    </div>
  );

  // GraphQL mutation hooks
  const [mutateToggle, { loading }] = useMutation(TOGGLE_RIDER, {
    refetchQueries: [{ query: GET_RIDERS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setIsLoading(false);
      showToast({
        type: 'success',
        title: t('Banner Status'),
        message: t('Status Changed Successfully'),
      });
    },
    onError: () => {
      setIsLoading(false);
      showToast({
        type: 'error',
        title: t('Banner Status'),
        message: t('Status Change Failed'),
      });
    },
  });

  const [mutateAccept, { loading: acceptLoading }] = useMutation(ACCEPT_RIDER_REQUEST, {
    refetchQueries: [{ query: GET_RIDERS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Success'),
        message: t('Rider request accepted successfully'),
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        title: t('Error'),
        message: t('Failed to accept rider request'),
      });
    },
  });

  // Handle status change
  const handleStatusChange = (value: string, rider: IRiderResponse) => {
    if (value === 'ACCEPTED') {
      mutateAccept({ variables: { id: rider._id } });
    } else if (value === 'REJECTED') {
      onRejectRider?.(rider);
    }
  };

  // Handle availability toggle
  const onHandleBannerStatusChange = async (isActive: boolean, id: string) => {
    try {
      setIsLoading(true);
      setSelectedRider({ id, isActive });
      await mutateToggle({ variables: { id } });
    } catch (error) {
      showToast({
        type: 'error',
        title: t('Banner Status'),
        message: t('Something went wrong'),
      });
    } finally {
      setSelectedRider({ id: '', isActive: false });
      setIsLoading(false);
    }
  };

  return [
    { headerName: t('Name'), propertyName: 'name' },
    { headerName: t('Email'), propertyName: 'email' },
    { headerName: t('Username'), propertyName: 'username' },
    { headerName: t('Phone'), propertyName: 'phone' },
    {
      headerName: t('Zone'),
      propertyName: 'zone',
      body: (rider: IRiderResponse) => rider.zone.title,
    },
    {
      headerName: t('Vehicle Type'),
      propertyName: 'vehicleType',
      body: (rider: IRiderResponse) =>
        toTextCase(rider.vehicleType.replaceAll('_', ' '), 'title'),
    },
    {
      headerName: t('Made By'),
      propertyName: 'madeBy',
      body: (rider: IRiderResponse) => (
        <span className={`px-2 py-1 rounded text-xs ${
          rider.madeBy === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {rider.madeBy === 'ADMIN' ? t('Admin') : t('Rider Request')}
        </span>
      ),
    },
    {
      headerName: t('Status'),
      propertyName: 'riderRequestStatus',
      body: (rider: IRiderResponse) => {
        // Show dropdown only for pending rider requests
        if (rider.madeBy === 'RIDER_REQUEST' && rider.riderRequestStatus === 'PENDING') {
          return (
            <Dropdown
              value={null}
              options={statusOptions}
              onChange={(e) => handleStatusChange(e.value.code, rider)}
              itemTemplate={itemTemplate}
              valueTemplate={() => (
                <div className="relative">
                  <Tag
                    severity="warning"
                    value={t('Pending')}
                    rounded
                    style={{ backgroundColor: '#fbbf24', color: '#92400e' }}
                  />
                  {rider.applyCount && rider.applyCount > 1 && (
                    <div className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center font-bold">
                      {rider.applyCount}
                    </div>
                  )}
                </div>
              )}
              placeholder={t('Pending')}
              className="w-[120px] outline outline-1 outline-gray-300"
              disabled={acceptLoading}
            />
          );
        }
        
        // Show tags for all other statuses
        const getStatusTag = () => {
          console.log('Rider status:', rider.riderRequestStatus, 'Type:', typeof rider.riderRequestStatus);
          switch (rider.riderRequestStatus) {
            case 'ACCEPTED':
              return (
                <Tag
                  severity="success"
                  value={t('Accepted')}
                  rounded
                />
              );
            case 'PENDING':
              return (
                <Tag
                  severity="warning"
                  value={t('Pending')}
                  rounded
                  style={{ backgroundColor: '#fbbf24', color: '#92400e' }}
                />
              );
            case 'REJECTED':
              return (
                <Tag
                  severity="danger"
                  value={t('Rejected')}
                  rounded
                />
              );
            default:
              console.log('Unknown status, falling back to pending:', rider.riderRequestStatus);
              return (
                <Tag
                  severity="warning"
                  value={t('Pending')}
                  rounded
                  style={{ backgroundColor: '#fbbf24', color: '#92400e' }}
                />
              );
          }
        };
        
        return getStatusTag();
      },
    },
    {
      headerName: t('Available'),
      propertyName: 'available',
      body: (rider: IRiderResponse) => (
        <CustomInputSwitch
          loading={rider._id === selectedRider.id && (loading || isLoading)}
          isActive={rider.available}
          onChange={async () => {
            if (loading || isLoading) return;
            await onHandleBannerStatusChange(!rider.available, rider._id);
          }}
        />
      ),
    },
    {
      propertyName: 'actions',
      body: (rider: IRiderResponse) => (
        <ActionMenu items={menuItems} data={rider} />
      ),
    },
  ];
};