'use client';

import {
  GET_CONFIGURATION,
  TOGGLE_VENDOR_TYPE_CONFIGURATION,
} from '@/lib/api/graphql';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import useToast from '@/lib/hooks/useToast';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import { useMutation } from '@apollo/client';

export default function VendorTypeConversionComponent() {
  // Hooks
  const { IS_MULTIVENDOR } = useConfiguration();
  const { showToast } = useToast();

  // API
  const [toggleVendorType, { loading }] = useMutation(
    TOGGLE_VENDOR_TYPE_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
      onCompleted: (data) => {
        console.log(data?.saveVendorTypeToggle);

        showToast({
          type: 'success',
          title: 'Toggle Vendor Type',
          message: 'Vendor type has been changed successfully.',
        });
      },
      onError: (error) => {
        showToast({
          type: 'error',
          title: 'Toggle Vendor Type',
          message: error?.message || 'Something went wrong',
        });
      },
    }
  );

  // Handlers
  const onHandleVendorTypeConversion = (isMultiVendor: boolean) => {
    try {
      toggleVendorType({
        variables: {
          configurationInput: { isMultiVendor },
        },
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Toggle Vendor Type',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (error as any)?.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="p-1 pt-3">
      <div className="p-3 shadow">
        <div className="w-full flex items-center justify-between">
          <div className="text-base font-semibold text-gray-800">
            Multivendor
          </div>

          <div>
            <CustomInputSwitch
              isActive={!!IS_MULTIVENDOR}
              loading={loading}
              onChange={() => {
                onHandleVendorTypeConversion(!IS_MULTIVENDOR);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
