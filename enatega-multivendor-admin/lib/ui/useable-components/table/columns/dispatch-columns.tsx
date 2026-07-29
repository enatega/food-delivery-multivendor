// Interfaces
import {
  IActiveOrders,
  IAssignRider,
} from '@/lib/utils/interfaces/dispatch.interface';
import {
  IDropdownSelectItem,
  IQueryResult,
  IRidersDataResponse,
} from '@/lib/utils/interfaces';
import { IColumnConfig } from '@/lib/utils/interfaces/table.interface';

// Prime React
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// GraphQL
import {
  ASSIGN_RIDER,
  GET_ACTIVE_ORDERS,
  GET_RIDERS,
  SUBSCRIPTION_ORDER,
  UPDATE_STATUS,
} from '@/lib/api/graphql';

// Hooks
import { useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useSubscription } from '@apollo/client';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// CSS
import classes from '@/lib/ui/screen-components/protected/super-admin/dispatch/view/main/index.module.css';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';

const valueTemplate = (option: IDropdownSelectItem) => (
  <div className="flex items-center justify-start gap-2 dark:text-white">
    <Tag severity={severityChecker(option?.code)} value={option?.label} rounded />
  </div>
);

const itemTemplate = (option: IDropdownSelectItem) => {
  return (
    <div
      className={`flex flex-row-reverse items-center justify-start gap-2 ${
        classes.dropDownItem
      } ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span>{option.label}</span>
    </div>
  );
};

function severityChecker(status: string | undefined) {
  switch (status) {
    case 'PENDING':
      return 'danger';
    case 'ASSIGNED':
      return 'info';
    case 'ACCEPTED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    case 'PICKED':
      return 'contrast';
    case 'DELIVERED':
      return 'success';
    default:
      return undefined;
  }
}

export const useDispatchOrderUI = () => {
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);

  const actionStatusOptions = useMemo(
    () => [
      {
        label: t('PENDING'),
        code: 'PENDING',
      },
      {
        label: t('ACCEPTED'),
        code: 'ACCEPTED',
      },
      {
        label: t('ASSIGNED'),
        code: 'ASSIGNED',
      },
      {
        label: t('PICKED'),
        code: 'PICKED',
      },
      {
        label: t('DELIVERED'),
        code: 'DELIVERED',
      },
      {
        label: t('CANCELLED'),
        code: 'CANCELLED',
      },
    ],
    [t]
  );

  const [riderOptions, setRiderOptions] = useState<IDropdownSelectItem[]>([]);
  const [isRiderLoading, setIsRiderLoading] = useState({
    _id: '',
    orderId: '',
    bool: false,
  });
  const [isStatusUpdating, setIsStatusUpdating] = useState({
    _id: '',
    bool: false,
  });

  const { data: ridersData } = useQueryGQL(GET_RIDERS, {}) as IQueryResult<
    IRidersDataResponse | undefined,
    undefined
  >;

  useEffect(() => {
    if (ridersData) {
      setRiderOptions(
        ridersData.riders.map((rider) => ({
          label: rider.name,
          code: rider.name.toUpperCase(),
          _id: rider._id,
        }))
      );
    }
  }, [ridersData]);

  const [assignRider] = useMutation<
    IAssignRider,
    { id: string; riderId: string }
  >(ASSIGN_RIDER, {
    onError: (error) => {
      showToast({
        type: 'error',
        title: t('Assign Rider'),
        message:
          error.cause?.message ||
          t('An error occured while assigning the job to rider'),
      });
    },
    onCompleted: () => {
      setIsRiderLoading({
        _id: '',
        orderId: '',
        bool: false,
      });
    },
    refetchQueries: [{ query: GET_ACTIVE_ORDERS }],
  });

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    onError: (err) => {
      showToast({
        type: 'error',
        message:
          err.cause?.message || t('An error occured while updating the status'),
        title: t('Edit Order Status'),
      });
    },
    onCompleted: () => {
      showToast({
        type: 'success',
        title: t('Order Status'),
        message: t('Order status has been updated successfully'),
      });
    },
    refetchQueries: [{ query: GET_ACTIVE_ORDERS }],
  });

  const handleAssignRider = async (
    item: IDropdownSelectItem,
    rowData: IActiveOrders
  ) => {
    if (!item._id) return;

    setIsRiderLoading({
      _id: item._id,
      bool: true,
      orderId: rowData._id,
    });

    const { data } = await assignRider({
      variables: {
        id: rowData._id,
        riderId: item._id,
      },
    });

    if (data) {
      await updateStatus({
        variables: {
          id: rowData._id,
          orderStatus: 'ASSIGNED',
        },
      });
      showToast({
        type: 'success',
        title: t('Assign Rider'),
        message: `${t('The order')} ${rowData.orderId} ${t(
          'has been successfully assigned to rider'
        )} ${item.label}`,
      });
    }
  };

  const handleStatusDropDownChange = async (
    e: DropdownChangeEvent,
    rowData: IActiveOrders
  ) => {
    setIsStatusUpdating({
      _id: rowData._id,
      bool: true,
    });

    try {
      await updateStatus({
        variables: {
          id: rowData._id,
          orderStatus: e.value.code,
        },
      });
    } catch {
      showToast({
        type: 'error',
        title: t('Order Status'),
        message: t('Something went wrong'),
      });
    } finally {
      setIsStatusUpdating({
        _id: rowData._id,
        bool: false,
      });
    }
  };

  const OrderFlowLabel = ({ rowData }: { rowData: IActiveOrders }) => {
    useSubscription(SUBSCRIPTION_ORDER, {
      variables: {
        id: rowData._id,
      },
      fetchPolicy: 'network-only',
    });

    return <p>{rowData.isPickedUp === false ? t('Delivery') : t('Pick Up')}</p>;
  };

  const renderRiderField = (rowData: IActiveOrders) => {
    const selectedRider: IDropdownSelectItem = {
      label: rowData?.rider?.name?.toString() ?? '',
      code: rowData?.rider?.name?.toString().toUpperCase() ?? '',
      _id: rowData?.rider?._id?.toString() ?? '',
    };

    if (rowData._id && !rowData.isPickedUp) {
      return (
        <Dropdown
          options={riderOptions}
          loading={
            isRiderLoading._id === selectedRider._id &&
            isRiderLoading.bool === true &&
            isRiderLoading.orderId === rowData._id
          }
          value={selectedRider}
          optionLabel="label"
          placeholder={t('Select Rider')}
          onChange={(e: DropdownChangeEvent) =>
            handleAssignRider(e.value, rowData)
          }
          className="min-w-[120px] outline outline-1 outline-gray-600"
        />
      );
    }

    return (
      <Dropdown
        options={[
          {
            code: 'Pickup',
            label: t('Pickup'),
          },
        ]}
        loading={isRiderLoading.bool && isRiderLoading._id === rowData._id}
        value={{
          code: 'Pickup',
          label: t('Pickup'),
        }}
        optionLabel="label"
        dropdownIcon={() => <></>}
        disabled
        className="min-w-[140px] outline outline-1 outline-gray-600"
      />
    );
  };

  const renderStatusField = (rowData: IActiveOrders) => {
    const filteredOptions = rowData.isPickedUp
      ? actionStatusOptions.filter((status) =>
          ['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED'].includes(
            status.code ?? ''
          )
        )
      : actionStatusOptions;

    const flowCodes = filteredOptions
      .filter((s) => s.code !== 'CANCELLED')
      .map((s) => s.code);
    const currentIndex = flowCodes.indexOf(rowData.orderStatus);

    const availableStatuses = filteredOptions.map((status) => {
      let disabled = false;

      if (status.code === 'CANCELLED') {
        if (
          rowData.orderStatus === 'DELIVERED' ||
          rowData.orderStatus === 'CANCELLED'
        ) {
          disabled = true;
        }
      } else {
        const statusIndex = flowCodes.indexOf(status.code);

        if (currentIndex !== -1 && statusIndex !== -1) {
          if (statusIndex < currentIndex) disabled = true;
          if (statusIndex > currentIndex + 1) disabled = true;
        } else {
          disabled = true;
        }

        if (status.code === 'ASSIGNED' && !rowData.rider) {
          disabled = true;
        }
      }

      return { ...status, disabled };
    });

    const currentStatus = availableStatuses.find(
      (status: IDropdownSelectItem) => status.code === rowData?.orderStatus
    );

    return (
      <Dropdown
        value={currentStatus}
        onChange={(e) => handleStatusDropDownChange(e, rowData)}
        options={availableStatuses}
        optionLabel="label"
        itemTemplate={itemTemplate}
        valueTemplate={valueTemplate}
        loading={isStatusUpdating.bool && isStatusUpdating._id === rowData._id}
        className="outline outline-1 outline-gray-300"
        optionDisabled="disabled"
        disabled={rowData.orderStatus === 'DELIVERED'}
      />
    );
  };

  const columns: IColumnConfig<IActiveOrders>[] = [
    {
      propertyName: 'orderId',
      headerName: t('Order Id'),
    },
    {
      propertyName: 'deliveryAddress.deliveryAddress',
      headerName: t('Order Information'),
      body: (rowData: IActiveOrders) => <OrderFlowLabel rowData={rowData} />,
    },
    {
      propertyName: 'restaurant.name',
      headerName: t('Store'),
    },
    {
      propertyName: 'paymentMethod',
      headerName: t('Payment'),
    },
    {
      propertyName: 'user.name',
      headerName: t('Customer'),
    },
    {
      propertyName: 'user.phone',
      headerName: t('Phone'),
    },
    {
      propertyName: 'rider.name',
      headerName: t('Rider'),
      body: (rowData: IActiveOrders) => renderRiderField(rowData),
    },
    {
      propertyName: 'createdAt',
      headerName: t('Order Time'),
      body: (rowData: IActiveOrders) => (
        <span>
          {new Date(rowData.createdAt)
            .toLocaleDateString()
            .concat(', ', new Date(rowData.createdAt).toLocaleTimeString())}
        </span>
      ),
    },
    {
      propertyName: 'orderStatus',
      headerName: t('Status'),
      body: (rowData: IActiveOrders) => renderStatusField(rowData),
    },
  ];

  return {
    columns,
    renderOrderFlowLabel: (rowData: IActiveOrders) => (
      <OrderFlowLabel rowData={rowData} />
    ),
    renderRiderField,
    renderStatusField,
  };
};
