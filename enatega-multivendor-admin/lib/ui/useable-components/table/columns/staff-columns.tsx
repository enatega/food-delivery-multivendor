// Core
import { useState } from 'react';

// Custom Components
import ActionMenu from '@/lib/ui/useable-components/action-menu';
import CustomInputSwitch from '../../custom-input-switch';

// Interfaces and Types
import { IStaffResponse } from '@/lib/utils/interfaces';
import { IActionMenuProps } from '@/lib/utils/interfaces/action-menu.interface';
import { useMutation } from '@apollo/client';
import { EDIT_STAFF } from '@/lib/api/graphql/mutations/staff';
import { GET_STAFFS } from '@/lib/api/graphql/queries/staff';
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';

export const STAFF_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IStaffResponse>['items'];
}) => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // States
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // GraphQL mutation hook
  const [mutateToggle, { loading }] = useMutation(EDIT_STAFF, {
    refetchQueries: [{ query: GET_STAFFS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      showToast({
        title: t('Toggle Staff Status'),
        type: 'success',
        message: t('The staff status has been updated successfully'),
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: t('Toggle Staff Status'),
        message:
          error.graphQLErrors[0].message ||
          error.clientErrors[0].message ||
          error.networkError?.message ||
          t('An error occured while updating the staff status'),
      });
    },
  });

  const onHandleBannerStatusChange = async (
    isActive: boolean,
    staff: IStaffResponse
  ) => {
    try {
      setSelectedStaffId(staff._id);
      await mutateToggle({
        variables: {
          staffInput: {
            _id: staff._id,
            name: staff.name,
            email: staff.email,
            password: staff.plainPassword,
            phone: staff.phone,
            permissions: staff.permissions,
            isActive,
          },
        },
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
    } finally {
      setSelectedStaffId(null);
    }
  };

  return [
    { headerName: t('Name'), propertyName: 'name' },
    { headerName: t('Email'), propertyName: 'email' },
    { headerName: t('Password'), propertyName: 'plainPassword' },
    { headerName: t('Phone'), propertyName: 'phone' },
    // ? Should this be added as it will make table overflow on normal screens
    // {
    //   headerName: 'Permissions',
    //   propertyName: 'permissions',
    //   body: (staff: IStaffResponse) => {
    //     return staff.permissions.map((v) => v + ', ');
    //   },
    // },
    {
      headerName: t('Status'),
      propertyName: 'status',
      body: (staff: IStaffResponse) => {
        return (
          <CustomInputSwitch
            loading={staff._id === selectedStaffId && loading}
            isActive={staff.isActive}
            onChange={async () => {
              await onHandleBannerStatusChange(!staff.isActive, staff);
            }}
          />
        );
      },
    },
    {
      propertyName: 'actions',
      body: (staff: IStaffResponse) => (
        <ActionMenu items={menuItems} data={staff} />
      ),
    },
  ];
};
