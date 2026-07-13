import { IToggleComponentProps } from '@/lib/utils/interfaces/toggle.interface';

const Toggle = ({
  checked,
  onClick,
  disabled,
  showLabel = false,
  placeholder,
}: IToggleComponentProps) => {
  return (
    <div className="flex items-center justify-between">
      {showLabel && <label className="text-sm font-[500]">{placeholder}</label>}
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only "
          checked={checked}
          onChange={onClick}
          disabled={disabled}
          
        />
        <div className="peer h-6 w-11 rounded-full  bg-gray-300 peer-checked:bg-primary-color peer-focus:outline-none dark:bg-gray-700"></div>
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white dark:bg-dark-950 transition-transform peer-checked:translate-x-5"></div>
      </label>
    </div>
  );
};

export default Toggle;
