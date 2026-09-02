'use client';

// Core
import { Form, Formik } from 'formik';
import { useContext, useState } from 'react';

// Interface and Types
import {
  IRestaurantsRestaurantLocationComponentProps,
  IVendorForm,
} from '@/lib/utils/interfaces';

// Icons
import UpdateRestaurantLocationBounds from '@/lib/ui/useable-components/google-maps/location-bounds-profile-restaurants';
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';

const initialValues: IVendorForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function UpdateRestaurantLocation({
  stepperProps,
  height,
  hideControls,
}: IRestaurantsRestaurantLocationComponentProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => {},
    order: -1,
  };

  // Context
  const { isLoaded } = useContext(GoogleMapsContext);

  // States
  const [formInitialValues] = useState<IVendorForm>({
    ...initialValues,
  });

  return (
    <div className="flex h-full w-full items-center justify-start dark:text-white dark:bg-dark-950 ">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <Formik
              initialValues={formInitialValues}
              validationSchema={null}
              enableReinitialize={true}
              onSubmit={() => {}}
              validateOnChange={false}
            >
              {({ handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-2 space-y-3">
                      {isLoaded && (
                        <UpdateRestaurantLocationBounds
                          onStepChange={() => onStepChange(order + 1)}
                          height={height}
                          hideControls={hideControls}
                        />
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
