// CSS
import './index.module.css';

// GraphQL
import { DELETE_COUPON, GET_COUPONS_PAGINATED } from '@/lib/api/graphql';
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';

// Interfaces
import {
  IActionMenuItem,
  IEditState,
  ILazyQueryResult,
} from '@/lib/utils/interfaces';
import {
  ICoupon,
  ICouponMainProps,
  IGetCouponsPaginatedData,
} from '@/lib/utils/interfaces/coupons.interface';

// Hooks
import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@apollo/client';
import useDebounce from '@/lib/hooks/useDebounce';

// Components
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import CouponTableHeader from '../header/table-header';

// Constants
import { COUPONS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/coupons-columns';

export default function CouponsMain({
  setVisible,
  isEditing,
  setIsEditing,
}: ICouponMainProps) {
  // Hooks
  const t = useTranslations();

  // Toast
  const { showToast } = useContext(ToastContext);

  // States
  const [selectedData, setSelectedData] = useState<ICoupon[]>([]);
  const [isDeleting, setIsDeleting] = useState<IEditState<ICoupon>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      discount: 0,
      enabled: false,
      title: '',
      lifeTimeActive: false,
      startDate: '',
      endDate: '',
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);
  const enabled =
    selectedActions.length === 1 && selectedActions[0] !== ''
      ? selectedActions[0] === 'true'
      : undefined;

  // Queries
  const { data, fetch } = useLazyQueryQL(GET_COUPONS_PAGINATED, {
    fetchPolicy: 'network-only',
    onCompleted: () => setIsLoading(false),
  }) as ILazyQueryResult<
    IGetCouponsPaginatedData | undefined,
    {
      page: number;
      limit: number;
      search?: string;
      enabled?: boolean;
    }
  >;

  // Mutations
  const [deleteCoupon, { loading: deleteCouponLoading }] = useMutation(
    DELETE_COUPON,
    {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
      onCompleted: () => {
        showToast({
          title: t('Delete Coupon'),
          type: 'success',
          message: t('Coupon has been deleted successfully'),
          duration: 2000,
        });
      },
      onError: (err) => {
        showToast({
          title: t('Delete Coupon'),
          type: 'error',
          message:
            err.message || t('An unknown error occured, please try again'),
          duration: 2000,
        });
      },
    }
  );

  // Delete Item
  async function deleteItem() {
    await deleteCoupon({
      variables: {
        id: isDeleting?.data?._id,
      },
    });
    setIsDeleting({
      bool: false,
      data: {
        __typename: '',
        _id: '',
        discount: 0,
        enabled: false,
        title: '',
        lifeTimeActive: false,
        startDate: '',
        endDate: '',
      },
    });
  }

  // Menu Items
  const menuItems: IActionMenuItem<ICoupon>[] = [
    {
      label: t('Edit'),
      command: (data?: ICoupon) => {
        if (data) {
          setIsEditing({
            bool: true,
            data: data,
          });
          setIsDeleting({
            bool: false,
            data: { ...isDeleting.data },
          });
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: ICoupon) => {
        if (data) {
          setIsDeleting({
            bool: true,
            data: data,
          });
          setIsEditing({
            bool: false,
            data: { ...isEditing.data },
          });
        }
      },
    },
  ];

  // UseEffects
  useEffect(() => {
    if (isEditing.bool) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [data, isEditing.bool]);

  useEffect(() => {
    setIsLoading(true);
    fetch({
      page: currentPage,
      limit: rowsPerPage,
      search: debouncedSearch || undefined,
      enabled,
    });
  }, [currentPage, rowsPerPage, debouncedSearch, enabled]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, enabled]);

  return (
    <div className="p-3">
      <Table
        columns={COUPONS_TABLE_COLUMNS({ menuItems })}
        data={data?.couponsPaginated?.data || []}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e)}
        loading={isLoading}
        header={
          <CouponTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        totalRecords={data?.couponsPaginated?.totalCount ?? 0}
        currentPage={data?.couponsPaginated?.currentPage ?? currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={(page, rowCount) => {
          setCurrentPage(page);
          setRowsPerPage(rowCount);
        }}
      />
      <CustomDialog
        onConfirm={deleteItem}
        onHide={() =>
          setIsDeleting({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              discount: 0,
              enabled: false,
              title: '',
              lifeTimeActive: false,
              endDate: '',
              startDate: '',
            },
          })
        }
        visible={isDeleting.bool}
        loading={deleteCouponLoading}
        message={t('Are you sure to delete the coupon?')}
      />
    </div>
  );
}
