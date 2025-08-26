import { ICustomInputSwitchComponentProps } from '@/lib/utils/interfaces';
import CustomLoader from '../custom-progress-indicator';

export default function CustomInputSwitch({
  loading,
  isActive,
  label,
  onChange,
  reverse = false,
  className
}: ICustomInputSwitchComponentProps) {
  return loading ? (
    <div className="ml-4">
      <CustomLoader size="14.7px" />
    </div>
  ) : (
    <label className={`ml-2 flex flex-shrink-0 cursor-pointer items-center ${className}`} >
      <div className="relative">
        <div
          className={`flex items-center gap-2 ${reverse && 'flex-row-reverse'}`}
        >
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isActive}
              onChange={onChange}
            />
            <div className="peer h-4 w-8 rounded-full bg-gray-300 peer-checked:bg-primary-color peer-focus:outline-none dark:bg-gray-700"></div>
            <div className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-gray-50 transition-transform peer-checked:translate-x-4"></div>
          </label>
          {label && <span className="ml-2">{label}</span>}
        </div>
      </div>
    </label>
  );
}
