'use client';
// Interface
import { IDropdownComponentProps } from '@/lib/utils/interfaces';

// Prime React
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import TextIconClickable from '../text-icon-clickable';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';


const CustomDropdownComponent = ({
  name,
  placeholder,
  options,
  selectedItem,
  setSelectedItem,
  showLabel,
  isLoading = false,
  filter = true,
  extraFooterButton,
  ...props
}: IDropdownComponentProps) => {
  const t = useTranslations();
  const { theme } = useTheme();

  const itemTemplate = (option: { label: string }) => {
    return (
      <div className="align-items-center flex dark:text-white ">
        <div>{option.label}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    return (
      <div className="flex justify-between space-x-2 dark:bg-dark-950">
        {extraFooterButton?.title && (
          <TextIconClickable
            className="w-full h-fit rounded  text-black dark:text-white"
            icon={faAdd}
            iconStyles={theme === 'dark' ? { color: 'white' } : { color: 'black' }}
            title={extraFooterButton.title}
            onClick={extraFooterButton.onChange}
          />
        )}
      </div>
    );
  };

  return !isLoading ? (
    <div className={`flex w-full flex-col justify-center gap-y-1`}>
      {showLabel && (
        <label htmlFor="username" className="text-sm font-[500] dark:text-white">
          {placeholder}
        </label>
      )}

      <Dropdown
        value={selectedItem}
        options={options}
        onChange={(e: DropdownChangeEvent) => setSelectedItem(name, e.value)}
        optionLabel="label"
        placeholder={placeholder}
        itemTemplate={itemTemplate}
        className="md:w-20rem p-dropdown-no-box-shadow m-0 h-10 w-full border dark:border-dark-600 dark:bg-dark-950 dark:text-white border-gray-300  p-0 align-middle text-sm focus:shadow-none focus:outline-none"
        panelClassName="border-gray-200 border-2"
        filter={filter}
        checkmark={true}
        panelFooterTemplate={panelFooterTemplate}
        {...props}
        emptyMessage={t("No available options")}
      />
    </div>
  ) : (
    <InputSkeleton />
  );
};

export default CustomDropdownComponent;
