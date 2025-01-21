'use client';

// Core imports
import { useContext, useRef } from 'react';

// PrimeReact components
import { Sidebar } from 'primereact/sidebar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';

// Interfaces
import { IFoodAddFormComponentProps } from '@/lib/utils/interfaces';

// Components
import FoodDetails from './food.index';
import VariationAddForm from './variations';
import { useTranslations } from 'next-intl';

const FoodForm = ({ position = 'right' }: IFoodAddFormComponentProps) => {
  // Hooks
  const t = useTranslations();

  // Ref
  const stepperRef = useRef(null);

  // Context
  const {
    activeIndex,
    isFoodFormVisible,
    onClearFoodData,
    onActiveStepChange,
  } = useContext(FoodsContext);

  // Handlers
  const onHandleStepChange = (order: number) => {
    onActiveStepChange(order);
  };

  const onSidebarHideHandler = () => {
    onClearFoodData();
  };

  return (
    <Sidebar
      visible={isFoodFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      className="w-full sm:w-[600px]"
    >
      <div ref={stepperRef}>
        <Stepper linear headerPosition="bottom" activeStep={activeIndex}>
          <StepperPanel header={t('Add Product')}>
            <FoodDetails
              stepperProps={{
                onStepChange: onHandleStepChange,
                order: activeIndex,
              }}
              isFoodFormVisible={isFoodFormVisible}
            />
          </StepperPanel>
          <StepperPanel header={t('Add Variations')}>
            <VariationAddForm
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

export default FoodForm;
