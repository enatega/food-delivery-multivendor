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

// Prime React
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// GraphQL
import {
  ASSIGN_RIDER,
  GET_ACTIVE_ORDERS,
  UPDATE_STATUS,
  SUBSCRIPTION_ORDER,
  GET_RIDERS,
} from '@/lib/api/graphql';

// Hooks
import { useContext, useState, useEffect } from 'react';
import { useMutation, useSubscription } from '@apollo/client';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// CSS
import classes from '@/lib/ui/screen-components/protected/super-admin/dispatch/view/main/index.module.css';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';

// Status templates
const valueTemplate = (option: IDropdownSelectItem) => (
  <div className="flex items-center justify-start gap-2">
    <Tag
      severity={severityChecker(option?.code)}
      value={option?.label}
      rounded
    />
  </div>
);

// Item templates
const itemTemplate = (option: IDropdownSelectItem) => {
  return (
    <div
      className={`flex flex-row-reverse items-center justify-start gap-2 ${classes.dropDownItem}`}
    >
      <span>{option.code}</span>
    </div>
  );
};

// Severity checker
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
  }
}

export const DISPATCH_TABLE_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);

  // Status options
  const actionStatusOptions = [
    {
      label: t('Pending'),
      code: 'PENDING',
      body: () => <Tag value={t('Pending')} severity="secondary" rounded />,
    },
    {
      label: t('Assigned'),
      code: 'ASSIGNED',
      body: () => <Tag value={t('Assigned')} severity="warning" rounded />,
    },
    {
      label: t('Accepted'),
      code: 'ACCEPTED',
      body: () => <Tag value={t('Accepted')} severity="info" rounded />,
    },
    {
      label: t('Delivered'),
      code: 'DELIVERED',
      body: () => <Tag value={t('Delivered')} severity="success" rounded />,
    },
    {
      label: t('Picked'),
      code: 'PICKED',
      body: () => <Tag value={t('Picked')} severity="contrast" rounded />,
    },
    {
      label: t('Rejected'),
      code: 'CANCELLED',
      body: () => <Tag value={t('Rejected')} severity="danger" rounded />,
    },
  ];

  // States
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

  // Query
  const { data: ridersData } = useQueryGQL(GET_RIDERS, {}) as IQueryResult<
    IRidersDataResponse | undefined,
    undefined
  >;

  // Side-Effects
  useEffect(() => {
    if (ridersData) {
      const newRiderOptions = ridersData.riders.map((rider) => ({
        label: rider.name,
        code: rider.name.toUpperCase(),
        _id: rider._id,
      }));
      setRiderOptions(newRiderOptions); // Set the rider options
    }
  }, [ridersData]);

  // Order Subscription
  const useOrderSubscription = (rowData: IActiveOrders) => {
    useSubscription(SUBSCRIPTION_ORDER, {
      variables: {
        _id: rowData._id,
      },
      fetchPolicy: 'network-only',
      onSubscriptionData: () => {
        // fetchActiveOrders({
        //   page: 1,
        //   rowsPerPage: 10,
        //   search: '',
        //   actions: [],
        // });
      },
    });
  };
  const OrderSubscription = ({ rowData }: { rowData: IActiveOrders }) => {
    useOrderSubscription(rowData);
    return <p>{rowData.isPickedUp === false ? "Not Picked" : "Picked"}</p>;
  };

  // Mutations
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
      console.log(err);
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

  //Handlers
  const handleAssignRider = async (
    item: IDropdownSelectItem,
    rowData: IActiveOrders
  ) => {
    if (item._id) {
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
        showToast({
          type: 'success',
          title: t('Assign Rider'),
          message: `${t('The order')} ${rowData.orderId} ${t('has been successfully assigned to rider')} ${item.label}`,
        });
      }
    }
  };

  const handleStatusDropDownChange = async (
    e: DropdownChangeEvent,
    rowData: IActiveOrders
  ) => {
    console.log(rowData);
    // // Set the loader to true for the specific row
    setIsStatusUpdating({
      _id: rowData._id,
      bool: true,
    });

    try {
      // Perform the update mutation
      await updateStatus({
        variables: {
          id: rowData._id,
          orderStatus: e.value.code,
        },
      });
    } catch (error) {
      // Handle error
      console.log(error);
      showToast({
        type: 'error',
        title: t('Order Status'),
        message: t('Something went wrong'),
      });
    } finally {
      // Set the loader to false after the mutation
      setIsStatusUpdating({
        _id: rowData._id,
        bool: false,
      });
    }
  };

  return [
    {
      propertyName: 'orderId',
      headerName: t('Order Id'),
    },
    {
      propertyName: 'deliveryAddress.deliveryAddress',
      headerName: t('Order Information'),
      body: (rowData: IActiveOrders) => <OrderSubscription rowData={rowData} />,
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
      body: (rowData: IActiveOrders) => {
        const selectedRider: IDropdownSelectItem = {
          label: rowData?.rider?.name.toString() ?? '',
          code: rowData?.rider?.name.toString().toUpperCase() ?? '',
          _id: rowData?.rider?._id.toString() ?? '',
        };
        if (rowData._id && !rowData.isPickedUp) {
          return (
            <div>
              <Dropdown
                options={riderOptions}
                loading={
                  isRiderLoading._id === selectedRider._id &&
                  isRiderLoading.bool === true &&
                  isRiderLoading.orderId === rowData._id
                }
                value={selectedRider}
                placeholder={t('Select Rider')}
                onChange={(e: DropdownChangeEvent) =>
                  handleAssignRider(e.value, rowData)
                }
                // filter={true}
                className="min-w-[120px] outline outline-1 outline-gray-300"
              />
            </div>
          );
        } else {
          return (
            <div>
              <Dropdown
                options={[
                  {
                    code: 'Pickup',
                    label: t('Pickup'),
                  },
                ]}
                loading={
                  isRiderLoading.bool && isRiderLoading._id === rowData._id
                }
                value={{
                  code: 'Pickup',
                  label: t('Pickup'),
                }}
                dropdownIcon={() => <></>}
                disabled={true}
                // onChange={(e: DropdownChangeEvent) =>
                //   handleAssignRider(e.value, rowData)
                // }
                // filter={true}
                className="min-w-[150px] outline outline-1 outline-gray-300"
              />
            </div>
          );
        }
      },
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
    // {
    //   propertyName: 'orderStatus',
    //   headerName: t('Status'),

    //   body: (rowData: IActiveOrders) => {
    //     const currentStatus = actionStatusOptions.find(
    //       (status: IDropdownSelectItem) => status.code === rowData?.orderStatus
    //     );

    //     return (
    //       <>
    //         <Dropdown
    //           value={currentStatus}
    //           onChange={(e) => handleStatusDropDownChange(e, rowData)}
    //           options={actionStatusOptions}
    //           itemTemplate={itemTemplate}
    //           valueTemplate={valueTemplate}
    //           loading={
    //             isStatusUpdating.bool && isStatusUpdating._id === rowData._id
    //           }
    //           className="outline outline-1 outline-gray-300"
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      propertyName: 'orderStatus',
      headerName: t('Status'),
      body: (rowData: IActiveOrders) => {
        // CHANGE 2: Filter status options based on whether it's a pickup order
        const availableStatuses = rowData.isPickedUp
          ? actionStatusOptions.filter((status) =>
              ['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED'].includes(
                status.code
              )
            )
          : actionStatusOptions;

        const currentStatus = availableStatuses.find(
          (status: IDropdownSelectItem) => status.code === rowData?.orderStatus
        );

        // CHANGE 3: Disable status changes for delivered orders
        const isDelivered = rowData.orderStatus === 'DELIVERED';

        return (
          <>
            <Dropdown
              value={currentStatus}
              onChange={(e) => handleStatusDropDownChange(e, rowData)}
              options={availableStatuses} // CHANGE 4: Use filtered status options
              itemTemplate={itemTemplate}
              valueTemplate={valueTemplate}
              loading={
                isStatusUpdating.bool && isStatusUpdating._id === rowData._id
              }
              className="outline outline-1 outline-gray-300"
              disabled={isDelivered} // CHANGE 5: Disable dropdown if delivered
            />
          </>
        );
      },
    },
  ];
};
