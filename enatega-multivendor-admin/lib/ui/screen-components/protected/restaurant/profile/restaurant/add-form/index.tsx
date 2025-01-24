// Core
import React, { useContext, useRef } from 'react';

// PrimeReact Components
import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

// Context
import { ProfileContext } from '@/lib/context/restaurant/profile.context';

// Custom Components
import UpdateRestaurantDetails from './update-profile-detail';
import UpdateRestaurantLocation from './update-restaurant-location';
import UpdateTiming from './update-timing';

// Interfaces & Types
import { IRestaurantsAddFormComponentProps } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

const UpdateRestaurantsProfileForm = ({
  position = 'right',
}: IRestaurantsAddFormComponentProps) => {
  // Hooks
  const t = useTranslations();

  // Refs
  const stepperRef = useRef(null);

  // Contexts
  const {
    isUpdateProfileVisible,
    setIsUpdateProfileVisible,
    activeIndex,
    onActiveStepChange,
  } = useContext(ProfileContext);

  // Handlers
  const onHandleStepChange = (order: number) => {
    console.log('next step', order);
    onActiveStepChange(order);
  };

  const onSidebarHideHandler = () => {
    onActiveStepChange(0);
    setIsUpdateProfileVisible(false);
  };

  return (
    <Sidebar
      visible={isUpdateProfileVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px]"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={t('Update Details')}>
            <UpdateRestaurantDetails
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header={t('Update Location')}>
            <UpdateRestaurantLocation
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
                isLastStep: true,
              }}
            />
          </StepperPanel>
          <StepperPanel header={t('Update Timings')}>
            <UpdateTiming
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
                isLastStep: true,
              }}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </Sidebar>
  );
};

export default UpdateRestaurantsProfileForm;
