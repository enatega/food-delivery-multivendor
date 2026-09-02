// CSS
import './index.module.css';

// GraphQL
import { DELETE_SHOP_TYPE, GET_SHOP_TYPES } from '@/lib/api/graphql';
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';

// Interfaces
import {
  IActionMenuItem,
  IEditState,
  IGetShopTypesData,
  ILazyQueryResult,
  IShopType,
  IShopTypesMainProps,
} from '@/lib/utils/interfaces';
import { IFilterType } from '@/lib/utils/interfaces/table.interface';

// Prime react
import { FilterMatchMode } from 'primereact/api';

// Hooks
import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@apollo/client';

// Components
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import ShopTypesTableHeader from '../header/table-header';
import Table from '@/lib/ui/useable-components/table';


// Constants
import { generateDummyShopTypes } from '@/lib/utils/dummy';

// Table COlumns
import { SHOP_TYPES_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/shop-types-columns';

export default function ShopTypesMain({
  setVisible,
  isEditing,
  setIsEditing,
}: IShopTypesMainProps) {
  // Hooks
  const t = useTranslations();

  // Toast
  const { showToast } = useContext(ToastContext);

  // States
  const [selectedData, setSelectedData] = useState<IShopType[]>([]);
  const [isDeleting, setIsDeleting] = useState<IEditState<IShopType>>({
    bool: false,
    data: {
      __typename: '',
      _id: '',
      name: '',
      image: "",
      isActive: false,
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const filters: IFilterType = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
  };

  // Queries
  const { data, fetch } = useLazyQueryQL(GET_SHOP_TYPES, {
    fetchPolicy: 'network-only',
    debounceMs: 5000,
    onCompleted: () => setIsLoading(false),
  }) as ILazyQueryResult<IGetShopTypesData | undefined, undefined>;

  // Mutations
  const [deleteShopType, { loading: deleteShopTypeLoading }] = useMutation(
    DELETE_SHOP_TYPE,
    {
      refetchQueries: [{ query: GET_SHOP_TYPES }],
      onCompleted: () => {
        showToast({
          title: t('Delete ShopType'),
          type: 'success',
          message: t('ShopType has been deleted successfully'),
          duration: 2000,
        });
      },
      onError: (err) => {
        showToast({
          title: t('Delete ShopType'),
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
    await deleteShopType({
      variables: {
        id: isDeleting?.data?._id,
      },
    });
    setIsDeleting({
      bool: false,
      data: {
        __typename: '',
        _id: '',
        isActive: false,
        image:"",
        name: '',
      },
    });
  }

  // Menu Items
  const menuItems: IActionMenuItem<IShopType>[] = [
    {
      label: t('Edit'),
      command: (data?: IShopType) => {
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
      command: (data?: IShopType) => {
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
    fetch();
  }, []);

  return (
    <div className="p-3">
      <Table
        columns={SHOP_TYPES_TABLE_COLUMNS({ menuItems })}
        data={data?.fetchShopTypes?.data || (isLoading ? generateDummyShopTypes() : [])}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e)}
        loading={isLoading}
        header={
          <ShopTypesTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
          />
        }
        filters={filters}
      />
      <CustomDialog
        onConfirm={deleteItem}
        onHide={() =>
          setIsDeleting({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              isActive: false,
              image:"",
              name: '',
            },
          })
        }
        visible={isDeleting.bool}
        loading={deleteShopTypeLoading}
        message={t('Are you sure to delete the coupon?')}
      />
    </div>
  );
}
