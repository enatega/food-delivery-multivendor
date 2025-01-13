'use client';

// Core imports
import { useContext, useRef } from 'react';

// Interfaces
import {
  IRestaurantContextData,
  IRestaurantsAddFormComponentProps,
} from '@/lib/utils/interfaces';

// PrimeReact components
import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

// Context
import { VendorLayoutRestaurantContext } from '@/lib/context/vendor/restaurant.context';

// Local components
import RestaurantDetails from './restaurant-details';
import RestaurantLocation from './restaurant-location';
import RestaurantTiming from './restaurant-timing';

const VendorRestaurantsForm = ({
  position = 'right',
}: IRestaurantsAddFormComponentProps) => {
  // Ref
  const stepperRef = useRef(null);

  // Context
  const {
    isRestaurantFormVisible,
    onSetRestaurantFormVisible,
    activeIndex,
    onActiveStepChange,
    onSetRestaurantContextData,
  } = useContext(VendorLayoutRestaurantContext);

  // Handlers
  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };
  const onSidebarHideHandler = () => {
    // Clean Context State
    onActiveStepChange(0);
    onSetRestaurantFormVisible(false);
    onSetRestaurantContextData({} as IRestaurantContextData);
  };

  return (
    <Sidebar
      visible={isRestaurantFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px]"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header="Add Details">
            <RestaurantDetails
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header="Location">
            <RestaurantLocation
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
          <StepperPanel header="Timing">
            <RestaurantTiming
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
            />
          </StepperPanel>
        </Stepper>
      </div>
    </Sidebar>
  );
};

export default VendorRestaurantsForm;
