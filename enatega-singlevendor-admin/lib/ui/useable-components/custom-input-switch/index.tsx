import { ICustomInputSwitchComponentProps } from '@/lib/utils/interfaces';
import CustomLoader from '../custom-progress-indicator';

export default function CustomInputSwitch({
  loading,
  disabled = false,
  isActive,
  label,
  onChange,
  reverse = false,
  className,
}: ICustomInputSwitchComponentProps) {
  const isDisabled = loading || disabled;

  return (
    <div className="flex items-center">
      <label
        className={`ml-2 flex flex-shrink-0 items-center ${
          isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${className ?? ''}`}
      >
        <div className="relative">
          <div
            className={`flex items-center gap-2 ${reverse && 'flex-row-reverse'}`}
          >
            <label
              className={`relative inline-flex items-center ${
                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isActive}
                onChange={onChange}
                disabled={isDisabled}
              />
              <div className="peer h-4 w-8 rounded-full bg-gray-300 peer-checked:bg-primary-color peer-focus:outline-none dark:bg-gray-700"></div>
              <div className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-gray-50 transition-transform peer-checked:translate-x-4"></div>
            </label>
            {label && <span className="ml-2">{label}</span>}
          </div>
        </div>
      </label>
      {loading && (
        <div className="ml-2">
          <CustomLoader size="14.7px" />
        </div>
      )}
    </div>
  );
}
