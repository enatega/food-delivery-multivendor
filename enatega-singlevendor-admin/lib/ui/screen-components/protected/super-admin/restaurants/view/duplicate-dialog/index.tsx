import { ApolloError, useMutation } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';

// Prime React
import { Dialog } from 'primereact/dialog';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

// API
import {
  DUPLICATE_RESTAURANT,
  GET_CLONED_RESTAURANTS,
  GET_VENDORS,
} from '@/lib/api/graphql';

// Interface and Types
import {
  IDropdownSelectItem,
  IQueryResult,
  IRestaurantDuplicateDialogComponentProps,
  IVendorReponse,
  IVendorResponseGraphQL,
} from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

const RestaurantDuplicateDialog = ({
  restaurantId,
  visible,
  onHide,
}: IRestaurantDuplicateDialogComponentProps) => {
  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);

  // States
  const [vendor, setSelectedVendor] = useState<IDropdownSelectItem>({
    label: '',
    code: '',
  });

  // API
  const vendorResponse = useQueryGQL(
    GET_VENDORS,
    { fetchPolicy: 'network-only' },
    {
      debounceMs: 300,
    }
  ) as IQueryResult<IVendorResponseGraphQL | undefined, undefined>;

  const [duplicateRestaurant, { loading }] = useMutation(
    DUPLICATE_RESTAURANT,

    {
      refetchQueries: [
        {
          query: GET_CLONED_RESTAURANTS,
        },
      ],

      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Store duplicate'),
          message: t(`Store has been duplicated successfully`),
          duration: 2000,
        });
        setSelectedVendor({ label: '', code: '' });
        onHide();
      },
      onError: ({ networkError, graphQLErrors }: ApolloError) => {
        showToast({
          type: 'error',
          title: t('Store duplicate'),
          message:
            graphQLErrors[0]?.message ??
            networkError?.message ??
            t(`Store duplicate  failed`),
          duration: 2500,
        });
        setSelectedVendor({ label: '', code: '' });
        onHide();
      },
    }
  );

  // Memoized Data
  const vendorsDropdown = useMemo(
    () =>
      vendorResponse?.data?.vendors?.map((vendorItem: IVendorReponse) => {
        return { label: vendorItem.email, code: vendorItem._id };
      }),
    [vendorResponse?.data?.vendors]
  );

  // Handlers
  const handleDuplicate = async () => {
    try {
      if (!vendor.code) {
        showToast({
          type: 'warn',
          title: t('Store duplicate'),
          message: t(`Please select a vendor`),
        });
        return;
      }

      await duplicateRestaurant({
        variables: { id: restaurantId, owner: vendor.code ?? '' },
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: t('Store duplicate'),
        message: t(`Store duplicate  failed`),
      });
      setSelectedVendor({ label: '', code: '' });
      onHide();
    }
  };

  const footer = (
    <div className="space-x-2">
      <CustomButton
        label={t('Cancel')}
        icon="pi pi-times"
        onClick={onHide}
        className="h-9 rounded border border-gray-300 bg-transparent px-5 text-black dark:text-white"
      />
      <CustomButton
        loading={loading}
        label={t('Duplicate')}
        className="h-9 rounded border-gray-300 bg-red-500 px-4 text-white"
        icon="pi pi-check"
        onClick={handleDuplicate}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: '32rem' }}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
      header={t('Duplicate Store')}
      modal
      footer={footer}
      onHide={onHide}
    >
      <CustomDropdownComponent
        name="vendor"
        placeholder={t('Select Vendor')}
        showLabel={true}
        selectedItem={vendor}
        setSelectedItem={(key: string, item: IDropdownSelectItem) =>
          setSelectedVendor(item)
        }
        options={vendorsDropdown ?? []}
      />
    </Dialog>
  );
};

export default RestaurantDuplicateDialog;
