/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useContext, useState, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsRotate,
  faCircleXmark,
  faPaperPlane,
  faDashboard,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContext } from '@/lib/context/global/toast.context';
import { useMutation } from '@apollo/client';
import {
  UPDATE_WITHDRAW_REQUEST,
  GET_ALL_WITHDRAW_REQUESTS,
} from '@/lib/api/graphql';
import { IWithDrawRequest } from '@/lib/utils/interfaces/withdraw-request.interface';
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { useTranslations } from 'next-intl'

export const WITHDRAW_REQUESTS_TABLE_COLUMNS = ({
  menuItems,
  currentPage,
  pageSize,
  search,
  selectedActions,
}: {
  menuItems: IActionMenuProps<IWithDrawRequest>['items'];
  currentPage: number;
  pageSize: number;
  search: string;
  selectedActions: string[];
}) => {
  // Hooks
  const { showToast } = useContext(ToastContext);
  const t = useTranslations();

  // States
  const [isChangingStatus, setIsChangingStatus] = useState({
    _id: '',
    bool: false,
  });
  const [selectedWithDrawRequest, setSelectedWithDrawRequest] =
    useState<string>('');

  const [updateWithdrawReqStatus, { loading: status_change_loading }] =
    useMutation(UPDATE_WITHDRAW_REQUEST, {
      onError: (err) => {
        console.log('error updating withdraw request status', err);
        showToast({
          type: 'error',
          title: 'Update Withdraw Request',
          message: err?.cause?.message || 'Failed to update the request',
        });
        setIsChangingStatus({ _id: '', bool: false });
      },
      onCompleted: (res) => {
        // console.log('Withdraw Request Status Updated', res);
        if (!res.updateWithdrawReqStatus.success) {
          showToast({
            type: 'error',
            title: 'Update Withdraw Request',
            message:
              res.updateWithdrawReqStatus.message ||
              'Failed to update the request',
          });
          setIsChangingStatus({ _id: '', bool: false });
          return;
        } else {
          switch (selectedWithDrawRequest) {
            case 'CANCELLED':
              showToast({
                type: 'info',
                title: 'Cancelled',
                message: 'The withdraw request has been cancelled.',
              });
              break;
            case 'TRANSFERRED':
              showToast({
                type: 'success',
                title: 'Transferred',
                message: 'The withdraw request has been marked as transferred.',
              });
              break;
            case 'REQUESTED':
              showToast({
                type: 'info',
                title: 'Requested',
                message: 'The withdraw request has been marked as requested.',
              });
          }

          //   showToast({
          //   type: 'success',
          //   title: 'Updated',
          //   message: 'The withdraw request has been updated successfully.....',
          // });

          setIsChangingStatus({ _id: '', bool: false });
        }
      },
      refetchQueries: [
        {
          query: GET_ALL_WITHDRAW_REQUESTS,
          variables: {
            pageSize: pageSize,
            pageNo: currentPage,
            search,
            userType:
              selectedActions.length > 0 ? selectedActions[0] : undefined,
          },
        },
      ],
    });

  // console.log("withDraw Data",{ data });

  // Handlers
  const handleDropDownChange = useCallback(
    async (e: any, rowData: IWithDrawRequest) => {
      try {
        setSelectedWithDrawRequest(e.value.code);
        console.log('New status:', setSelectedWithDrawRequest);
        setIsChangingStatus({
          _id: rowData._id,
          bool: true,
        });
        await updateWithdrawReqStatus({
          variables: {
            id: rowData._id,
            status: e.value.code,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    [updateWithdrawReqStatus]
  );

  // Options
  const options = useMemo(
    () => [
      {
        code: 'REQUESTED',
        label: t('REQUESTED'),
      },
      {
        code: 'TRANSFERRED',
        label: t('TRANSFERRED'),
      },
      {
        code: 'CANCELLED',
        label: t('CANCELLED'),
      },
    ],
    []
  );

  // const itemTemplate = (option: any) => (
  //   <div className="flex gap-2">
  //     <FontAwesomeIcon
  //       icon={
  //         option.code === 'CANCELLED'
  //           ? faCircleXmark
  //           : option.code === 'TRANSFERRED'
  //             ? faArrowsRotate
  //             : option.code === 'REQUESTED'
  //               ? faPaperPlane
  //               : faDashboard
  //       }
  //       color={option.code === 'CANCELLED' ? 'red' : 'black'}
  //       className="h-4 w-4"
  //     />
  //      <span className="inline-flex items-center">{option.label}</span>
  //   </div>
  // );

  const itemTemplate = (option: any) => (
    <div className="flex h-6 items-center gap-2">
      <div className="flex h-full items-center">
        <FontAwesomeIcon
          icon={
            option.code === 'CANCELLED'
              ? faCircleXmark
              : option.code === 'TRANSFERRED'
                ? faArrowsRotate
                : option.code === 'REQUESTED'
                  ? faPaperPlane
                  : faDashboard
          }
          color={option.code === 'CANCELLED' ? 'red' : 'black'}
          className="h-4 w-4 dark:text-white"
        />
      </div>
      <div className="flex h-full items-center">
        <span>{option.label}</span>
      </div>
    </div>
  );

  // Templates
  const valueTemplate = (option: any) => {
    const findSeverity = (code: string | undefined) => {
      switch (code) {
        case 'REQUESTED':
          return 'info';
        case 'TRANSFERRED':
          return 'success';
        case 'CANCELLED':
          return 'danger';
        default:
          return 'warning';
      }
    };

    return (
      <Tag
        severity={findSeverity(option?.code ? String(option?.code) : undefined)}
        value={option?.label}
        rounded
      />
    );
  };

  return useMemo(
    () => [
      {
        headerName: t('RequestID'),
        propertyName: 'requestId',
      },
      {
        headerName: t('User Type'),
        propertyName: 'rider.name',
        body: (rowData: IWithDrawRequest) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {rowData.rider?.name || rowData.store?.slug || '-'}
            </span>
            <span className="text-sm text-gray-500">
              {rowData.rider ? 'Rider' : 'Restaurant'}
            </span>
          </div>
        ),
      },
      {
        headerName: t('Amount'),
        propertyName: 'requestAmount',
        body: (rowData: IWithDrawRequest) => (
          <span className="font-medium">
            ${rowData?.requestAmount.toFixed(2)}
          </span>
        ),
      },
      {
        headerName: t('Date'),
        propertyName: 'requestTime',
        body: (rowData: IWithDrawRequest) => {
          const date = new Date(rowData.requestTime);
          const formattedDate = date?.toISOString().split('T')[0];
          return <div>{formattedDate}</div>;
        },
      },
      {
        headerName: t('Status'),
        propertyName: 'status',
        body: (rowData: IWithDrawRequest) => (
          <Dropdown
            value={options?.find((option) => option?.code === rowData.status)}
            options={options}
            onChange={(e) => handleDropDownChange(e, rowData)}
            itemTemplate={itemTemplate}
            valueTemplate={valueTemplate}
            loading={
              isChangingStatus.bool &&
              status_change_loading &&
              isChangingStatus._id === rowData._id
            }
            className="border border-gray-200"
          />
        ),
      },
      // {
      //   propertyName: 'actions',
      //   body: (rowData: IWithDrawRequest) => (
      //     <ActionMenu items={menuItems} data={rowData} menuRef={menuRef} />
      //   ),
      // },
    ],
    [
      handleDropDownChange,
      status_change_loading,
      isChangingStatus,
      options,
      menuItems,
    ]
  );
};
