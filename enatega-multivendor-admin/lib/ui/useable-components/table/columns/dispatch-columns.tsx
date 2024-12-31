// Interfaces
import {
  IActiveOrders,
  // IGetRidersByZone,
  // IGetRidersByZoneVariables,
  // IRidersByZone,
} from '@/lib/utils/interfaces/dispatch.interface';
import { IDropdownSelectItem } from '@/lib/utils/interfaces';

// Icons
// import {
//   faDashboard,
//   faTrash,
//   faTruck,
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';

// Prime React
import { Tag } from 'primereact/tag';
// import { DropdownChangeEvent } from 'primereact/dropdown';

// GraphQL
import {
  // ASSIGN_RIDER,
  // GET_ACTIVE_ORDERS,
  // GET_RIDERS_BY_ZONE,
  // UPDATE_STATUS,
  SUBSCRIPTION_ORDER,
} from '@/lib/api/graphql';

// Hooks
import {
  useMemo,
  // useContext,
  //  useState
} from 'react';
import {
  // LazyQueryResultTuple,
  // useLazyQuery,
  // useMutation,
  useSubscription,
} from '@apollo/client';

// Contexts
// import { ToastContext } from '@/lib/context/global/toast.context';

// CSS
// import classes from '@/lib/ui/screen-components/protected/super-admin/dispatch/view/main/index.module.css';

export const DISPATCH_TABLE_COLUMNS = () => {
  // Toast
  // const { showToast } = useContext(ToastContext);

  // States
  // const [riderOptions, setRiderOptions] = useState<IDropdownSelectItem[]>([]);
  // const [isRiderLoading, setIsRiderLoading] = useState({
  //   _id: '',
  //   bool: false,
  // });
  // const [isStatusUpdating, setIsStatusUpdating] = useState({
  //   _id: '',
  //   bool: false,
  // });

  // Order Subscription
  const useOrderSubscription = (rowData: IActiveOrders) => {
    useSubscription(SUBSCRIPTION_ORDER, {
      variables: {
        _id: rowData._id,
      },
      fetchPolicy: 'network-only',
    });
  };
  const OrderSubscription = ({ rowData }: { rowData: IActiveOrders }) => {
    useOrderSubscription(rowData);
    return <p>{rowData.deliveryAddress.deliveryAddress}</p>;
  };

  // Queries
  // const [fetch] = useLazyQuery(GET_RIDERS_BY_ZONE) as LazyQueryResultTuple<
  //   IGetRidersByZone | undefined,
  //   IGetRidersByZoneVariables
  // >;

  // Mutations
  // const [assignRider] = useMutation(ASSIGN_RIDER, {
  //   onError: (error) => {
  //     showToast({
  //       type: 'error',
  //       title: 'Assign Rider',
  //       message:
  //         error.cause?.message ||
  //         'An error occured while assigning the job to rider',
  //     });
  //   },
  //   refetchQueries: [{ query: GET_ACTIVE_ORDERS }],
  // });
  // const [updateStatus] = useMutation(UPDATE_STATUS, {
  //   onError: (err) =>
  //     showToast({
  //       type: 'error',
  //       message:
  //         err.cause?.message || 'An error occured while updating the status',
  //       title: 'Edit Order Status',
  //     }),
  //   onCompleted: () => {
  //     showToast({
  //       type: 'success',
  //       title: 'Order Status',
  //       message: 'Order status has been updated successfully',
  //     });
  //   },
  //   refetchQueries: [{ query: GET_ACTIVE_ORDERS }],
  // });

  // Handlers
  // const handleRiderClick = async (
  //   rowData: IActiveOrders
  // ): Promise<{ data?: IRidersByZone[]; loading: boolean }> => {
  //   const res = await fetch({
  //     variables: {
  //       id: rowData.zone._id,
  //     },
  //   });
  //   return {
  //     data: res.data?.ridersByZone,
  //     loading: res.loading,
  //   };
  // };

  // const handleAssignRider = async (
  //   item: IDropdownSelectItem,
  //   rowData: IActiveOrders
  // ) => {
  //   if (item._id) {
  //     setIsRiderLoading({
  //       _id: item._id,
  //       bool: true,
  //     });

  //     const { data } = await assignRider({
  //       variables: {
  //         id: rowData._id,
  //         riderId: item._id,
  //       },
  //     });
  //     if (data) {
  //       showToast({
  //         type: 'success',
  //         title: 'Assign Rider',
  //         message: `The order ${rowData.orderId} has been successfully assigned to rider ${item.label}`,
  //       });
  //     }
  //   }
  //   setIsRiderLoading({
  //     _id: '',
  //     bool: false,
  //   });
  // };

  // const handleStatusDropDownChange = async (
  //   e: DropdownChangeEvent,
  //   rowData: IActiveOrders
  // ) => {
  //   setIsStatusUpdating({
  //     _id: rowData._id,
  //     bool: true,
  //   });
  //   try {
  //     await updateStatus({
  //       variables: {
  //         id: rowData._id,
  //         orderStatus: e.value.code,
  //       },
  //     });
  //   } catch (error) {
  //     showToast({
  //       type: 'error',
  //       title: 'Order Status',
  //       message: 'Something went wrong',
  //     });
  //   } finally {
  //     setIsStatusUpdating({
  //       _id: rowData._id,
  //       bool: false,
  //     });
  //   }
  // };

  // Status options
  const actionStatusOptions = useMemo(
    () => [
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
    ],
    []
  );

  // Status templates
  // const valueTemplate = (option: IDropdownSelectItem) => (
  //   <div className="flex items-center justify-start gap-2">
  //     <Tag
  //       severity={severityChecker(option?.code)}
  //       value={option?.label}
  //       rounded
  //     />
  //   </div>
  // );

  // const itemTemplate = (option: IDropdownSelectItem) => {
  //   if (option.code === 'PENDING' || option.code === 'ASSIGNED') return;
  //   return (
  //     <div
  //       className={`flex flex-row-reverse items-center justify-start gap-2 ${option.code === 'PENDING' || option.code === 'ASSIGNED' ? 'hidden' : 'visible'} ${classes.dropDownItem}`}
  //     >
  //       <span>
  //         {option.code === 'CANCELLED'
  //           ? 'Reject'
  //           : option.code === 'ACCEPTED'
  //             ? 'Accept'
  //             : option.code === 'DELIVERED'
  //               ? 'Delivered'
  //               : ''}
  //       </span>
  //       <FontAwesomeIcon
  //         icon={
  //           option.code === 'CANCELLED'
  //             ? faTrash
  //             : option.code === 'ACCEPTED'
  //               ? faCircleCheck
  //               : option.code === 'DELIVERED'
  //                 ? faTruck
  //                 : faDashboard
  //         }
  //         color={option.code === 'CANCELLED' ? 'red' : 'black'}
  //       />
  //     </div>
  //   );
  // };

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
        return 'contrast'
    }
  }
  const dispatch_columns = useMemo(
    () => [
      {
        propertyName: 'deliveryAddress.deliveryAddress',
        headerName: 'Order Information',
        body: (rowData: IActiveOrders) => (
          <OrderSubscription rowData={rowData} />
        ),
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
          // async function handleClick(rowData: IActiveOrders) {
          //   setIsRiderLoading({
          //     _id: rowData._id,
          //     bool: true,
          //   });
          //   const { data } = await handleRiderClick(rowData);
          //   data?.forEach((rider) => {
          //     setRiderOptions((prev) => [
          //       ...prev,
          //       {
          //         label: rider.name,
          //         code: rider.name.toUpperCase(),
          //         _id: rider._id,
          //       },
          //     ]);
          //   });
          //   setIsRiderLoading({
          //     _id: rowData._id,
          //     bool: false,
          //   });
          // }

          // Selected rider
          const selectedRider: IDropdownSelectItem = {
            label: rowData?.rider?.name.toString() ?? 'Select Rider',
            code:
              rowData?.rider?.name.toString().toUpperCase() ?? 'SELECT RIDER',
            _id: rowData?.rider?._id.toString() ?? '',
          };
          return (
            // <div onClick={() => handleClick(rowData)}> TO BE REPLACED WITH THE LOWER DIV
            <div>
              {/* <Dropdown
                options={
                  isRiderLoading._id === rowData._id && riderOptions
                    ? riderOptions
                    : [selectedRider]
                }
                loading={
                  isRiderLoading.bool && isRiderLoading._id === rowData._id
                }
                value={selectedRider ?? 'Select Rider'}
                onChange={(e: DropdownChangeEvent) =>
                  handleAssignRider(e.value, rowData)
                }
                filter={true}
                className="outline outline-1 outline-gray-300"
              /> */}
              {selectedRider.label ?? 'Select Rider'}
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
            (status: IDropdownSelectItem) =>
              status.code === rowData?.orderStatus
          );
          return (
            <>
              {/* <Dropdown
              value={currentStatus}
              onChange={(e) => handleStatusDropDownChange(e, rowData)}
              options={actionStatusOptions}
              itemTemplate={itemTemplate}
              valueTemplate={valueTemplate}
              loading={
                isStatusUpdating.bool && isStatusUpdating._id === rowData._id
              }
              className="outline outline-1 outline-gray-300"
            /> */}
              <Tag
                severity={severityChecker(currentStatus?.code)}
                value={currentStatus?.label}
              />
            </>
          );
        },
      },
    ],
    []
  );
  return dispatch_columns;
};
