// Interfaces
import { IActionMenuProps, IShopType } from '@/lib/utils/interfaces';


// Components
import CustomInputSwitch from '../../custom-input-switch';
import ActionMenu from '../../action-menu';

// Hooks
import { useContext, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';

//GraphQL
import { GET_COUPONS, UPDATE_SHOP_TYPE } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const SHOP_TYPES_TABLE_COLUMNS = ({
  menuItems,

}: {
  menuItems: IActionMenuProps<IShopType>['items'];
}) => {
  // Hooks
  const { showToast } = useContext(ToastContext);
  // Hooks
  const t = useTranslations();

  // States
  const [editShopTypeLoading, setEditShopTypeLoading] = useState({
    _id: '',
    bool: false,
  });

  // Mutations
  const [editShopType, { loading }] = useMutation(UPDATE_SHOP_TYPE, {
    refetchQueries: [{ query: GET_COUPONS }],
    onCompleted: () => {
      showToast({
        title: t('Edit ShopType'),
        type: 'success',
        message: t('ShopType Status has been edited successfully'),
        duration: 2500,
      });
      setEditShopTypeLoading({
        _id: '',
        bool: false,
      });
    },
    onError: (err) => {
      showToast({
        title: t('Edit ShopType'),
        type: 'error',
        message:
          err.message ||
          err?.cause?.message ||
          t('Something went wrong, please try again'),
        duration: 2500,
      });
      setEditShopTypeLoading({
        bool: false,
        _id: '',
      });
    },
  });

  // Handlers
  async function handleEnableField(rowData: IShopType) {
    setEditShopTypeLoading({
      bool: true,
      _id: rowData._id,
    });
    const updatedShopType = {
      _id: rowData?._id,
      name: rowData?.name,
      image: rowData?.image,
      isActive: !rowData?.isActive,
    };
    await editShopType({
      variables: {
        dto: updatedShopType,
      },
    });
  }



  // Columns
  const shop_type_columns = useMemo(
    () => [
        {
            headerName: t('Image'),
            propertyName: 'image',
            body: (rowData: IShopType) => (
                  <Image
                    width={40}
                    height={40}
                    alt="Banner"
                    src={
                      rowData.image
                        ? rowData.image
                        : 'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    }
                  />
                )
              
            
          },
      {
        headerName: t('Title'),
        propertyName: 'name',
      },
      {
        headerName: t('Status'),
        propertyName: 'isActive',
        body: (rowData: IShopType) => {
          return (
            <div className="flex w-full cursor-pointer items-center justify-between gap-2">
              <div className="flex w-20 items-start">
                <CustomInputSwitch
                  isActive={rowData.isActive}
                  className={
                    rowData?.isActive
                      ? 'p-inputswitch-checked absolute'
                      : 'absolute'
                  }
                  onChange={() => handleEnableField(rowData)}
                  loading={rowData._id === editShopTypeLoading._id && loading}
                />
              </div>
              <ActionMenu data={rowData} items={menuItems} />
            </div>
          );
        },
      },
    ],
    [loading, editShopTypeLoading.bool, menuItems]
  );
  
  return shop_type_columns;
};
