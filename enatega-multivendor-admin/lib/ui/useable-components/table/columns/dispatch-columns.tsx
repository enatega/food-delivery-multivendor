// Interfaces
import { IActiveOrders } from '@/lib/utils/interfaces/dispatch.interface';
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

// Status options
const actionStatusOptions = [
  {
    label: 'Pending',
    code: 'PENDING',
    body: () => <Tag value="Pending" severity="secondary" rounded />,
  },
  {
    label: 'Assigned',
    code: 'ASSIGNED',
    body: () => <Tag value="Assigned" severity="warning" rounded />,
  },
  {
    label: 'Accepted',
    code: 'ACCEPTED',
    body: () => <Tag value="Accepted" severity="info" rounded />,
  },
  {
    label: 'Delivered',
    code: 'DELIVERED',
    body: () => <Tag value="Delivered" severity="success" rounded />,
  },
  {
    label: 'Picked',
    code: 'PICKED',
    body: () => <Tag value="Picked" severity="contrast" rounded />,
  },
  {
    label: 'Rejected',
    code: 'CANCELLED',
    body: () => <Tag value="Reject" severity="danger" rounded />,
  },
];

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

export const DISPATCH_TABLE_COLUMNS = (
  fetchActiveOrders: (variables?: undefined) => void
) => {
  // Toast
  const { showToast } = useContext(ToastContext);

  // States
  const [riderOptions, setRiderOptions] = useState<IDropdownSelectItem[]>([]);
  const [isRiderLoading, setIsRiderLoading] = useState({
    _id: '',
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
      console.log(ridersData);
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
        fetchActiveOrders();
      },
    });
  };
  const OrderSubscription = ({ rowData }: { rowData: IActiveOrders }) => {
    useOrderSubscription(rowData);
    return <p>{rowData.deliveryAddress.deliveryAddress}</p>;
  };

  // Mutations
  const [assignRider] = useMutation(ASSIGN_RIDER, {
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Assign Rider',
        message:
          error.cause?.message ||
          'An error occured while assigning the job to rider',
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
          err.cause?.message || 'An error occured while updating the status',
        title: 'Edit Order Status',
      });
    },
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Order Status',
        message: 'Order status has been updated successfully',
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
          title: 'Assign Rider',
          message: `The order ${rowData.orderId} has been successfully assigned to rider ${item.label}`,
        });
      }
    }
    setIsRiderLoading({
      _id: '',
      bool: false,
    });
  };

  const handleStatusDropDownChange = async (
    e: DropdownChangeEvent,
    rowData: IActiveOrders
  ) => {
    // Set the loader to true for the specific row
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
      showToast({
        type: 'error',
        title: 'Order Status',
        message: 'Something went wrong',
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
      headerName: 'Order Id',
    },
    {
      propertyName: 'deliveryAddress.deliveryAddress',
      headerName: 'Order Information',
      body: (rowData: IActiveOrders) => <OrderSubscription rowData={rowData} />,
    },
    {
      propertyName: 'restaurant.name',
      headerName: 'Store',
    },
    {
      propertyName: 'paymentMethod',
      headerName: 'Payment',
    },
    {
      propertyName: 'rider.name',
      headerName: 'Rider',
      body: (rowData: IActiveOrders) => {
        const selectedRider: IDropdownSelectItem = {
          label: rowData?.rider?.name.toString() ?? '',
          code: rowData?.rider?.name.toString().toUpperCase() ?? '',
          _id: rowData?.rider?._id.toString() ?? '',
        };

        return (
          <div>
            <Dropdown
              options={riderOptions}
              loading={
                isRiderLoading.bool && isRiderLoading._id === rowData._id
              }
              value={selectedRider}
              placeholder="Select Rider"
              onChange={(e: DropdownChangeEvent) =>
                handleAssignRider(e.value, rowData)
              }
              // filter={true}
              className="outline outline-1 min-w-[120px] outline-gray-300"
            />
          </div>
        );
      },
    },
    {
      propertyName: 'createdAt',
      headerName: 'Order Time',
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
      headerName: 'Status',

      body: (rowData: IActiveOrders) => {
        const currentStatus = actionStatusOptions.find(
          (status: IDropdownSelectItem) => status.code === rowData?.orderStatus
        );

        return (
          <>
            <Dropdown
              value={currentStatus}
              onChange={(e) => handleStatusDropDownChange(e, rowData)}
              options={actionStatusOptions}
              itemTemplate={itemTemplate}
              valueTemplate={valueTemplate}
              loading={
                isStatusUpdating.bool && isStatusUpdating._id === rowData._id
              }
              className="outline outline-1 outline-gray-300"
            />
          </>
        );
      },
    },
  ];
};
