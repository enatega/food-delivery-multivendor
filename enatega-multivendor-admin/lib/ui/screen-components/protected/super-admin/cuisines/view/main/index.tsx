// GrpphQL
import { DELETE_CUISINE, GET_CUISINES } from '@/lib/api/graphql';

// Interfaces
import {
  IActionMenuItem,
  IEditState,
  ILazyQueryResult,
} from '@/lib/utils/interfaces';
import {
  ICuisine,
  ICuisineMainProps,
  IGetCuisinesData,
} from '@/lib/utils/interfaces/cuisine.interface';
import { FilterMatchMode } from 'primereact/api';

//  Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Hooks
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';
import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

// Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import CuisineTableHeader from '../header/table-header';
import { generateDummyCuisines } from '@/lib/utils/dummy';
import { CUISINE_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/cuisine-columns';
import { useTranslations } from 'next-intl';

export default function CuisinesMain({
  setVisible,
  isEditing,
  setIsEditing,
}: ICuisineMainProps) {
  // Mutations
  const [deleteCuisine, { loading: deleteCuisineLoading }] = useMutation(
    DELETE_CUISINE,
    {
      refetchQueries: [{ query: GET_CUISINES }],
      fetchPolicy: 'network-only',
    }
  );

  // Queries
  const { data, fetch } = useLazyQueryQL(GET_CUISINES, {
    onCompleted: () => setIsLoading(false),
  }) as ILazyQueryResult<IGetCuisinesData | undefined, undefined>;

  // Hooks
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);

  // States
  const [selectedData, setSelectedData] = useState<ICuisine[]>([]);
  const [isDeleting, setIsDeleting] = useState<IEditState<ICuisine>>({
    bool: false,
    data: {
      _id: '',
      __typename: '',
      description: '',
      name: '',
      shopType: '',
      image: '',
    },
  });
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // Filters
  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    shopType: {
      value:
        selectedActions.length === 0 || selectedActions.length === 2
          ? null // No filter when none or both are selected
          : selectedActions,
      matchMode: FilterMatchMode.IN, // Use "IN" to filter based on multiple values
    },
  };

  // Menu Items
  const menuItems: IActionMenuItem<ICuisine>[] = [
    {
      label: t('Edit'),
      command: (data?: ICuisine) => {
        if (data) {
          setIsEditing({
            bool: true,
            data: data,
          });
          setIsDeleting({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              description: '',
              name: '',
              shopType: '',
              image: '',
            },
          });
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: ICuisine) => {
        if (data) {
          setIsDeleting({
            bool: true,
            data: data,
          });
          setIsEditing({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              description: '',
              name: '',
              shopType: '',
              image: '',
            },
          });
        }
      },
    },
  ];

  // Handlers
  async function deleteItem() {
    try {
      await deleteCuisine({ variables: { id: isDeleting?.data?._id } });
      showToast({
        title: t('Delete Cuisine'),
        type: 'success',
        message: t('Cuisine has been deleted successfully'),
        duration: 2000,
      });
      setIsDeleting({ bool: false, data: { ...isDeleting.data } });
    } catch (err) {
      showToast({
        title: t('Delete Cuisine'),
        type: 'error',
        message: t('Cuisine Deletion Failed'),
        duration: 2000,
      });
    }
  }

  const onFetchCuisines = () => {
    setIsLoading(true);
    fetch();
  };

  // UseEffects
  useEffect(() => {
    setVisible(isEditing.bool);
  }, [data, isEditing.bool]);

  useEffect(() => {
    onFetchCuisines();
  }, []);

  return (
    <div className="p-3">
      <Table
        columns={CUISINE_TABLE_COLUMNS({ menuItems })}
        data={data?.cuisines || (isLoading ? generateDummyCuisines() : [])}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e as ICuisine[])}
        filters={filters}
        loading={isLoading}
        header={
          <CuisineTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
      />
      <CustomDialog
        onConfirm={deleteItem}
        onHide={() => {
          setIsDeleting({ bool: false, data: { ...isDeleting.data } });
          setIsEditing({ bool: false, data: { ...isEditing.data } });
        }}
        visible={isDeleting.bool}
        loading={deleteCuisineLoading}
        message={t('Are you sure to delete the cuisine?')}
      />
    </div>
  );
}
