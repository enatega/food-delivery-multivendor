import CustomButton from '@/lib/ui/useable-components/button';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import { IConfigCardComponentProps } from '@/lib/utils/interfaces/configurations.interface';
import React from 'react';

const ConfigCard = ({
  buttonLoading,
  children,
  cardTitle,
  toggleLabel,
  toggleValue,
  toggleOnChange = () => {},
}: IConfigCardComponentProps) => {
  return (
    <div className="flex w-full sm:w-2/3 mx-auto flex-col overflow-hidden rounded-lg border">
      {/* header */}
      <div className="flex items-center justify-between bg-[#F4F4F5] dark:bg-dark-900 p-4">
        <span className="select-none text-lg font-bold">{cardTitle}</span>
        {toggleLabel && (
          <>
            <CustomInputSwitch
              label={toggleLabel}
              onChange={toggleOnChange}
              isActive={toggleValue ?? false}
              reverse
            />
          </>
        )}
      </div>

      {/* center */}
      <div className="p-5">{children}</div>

      {/* footer */}
      <div className="flex justify-end p-4">
        <CustomButton
          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
          label={'Save'}
          type="submit"
          loading={buttonLoading}
        />
      </div>
    </div>
  );
};

export default ConfigCard;
