import { ITimeTextField } from '@/lib/utils/interfaces';
import TimeInputSkeleton from '../custom-skeletons/time-inputfield.skeleton';

const CustomTimeInput = ({
  className,
  placeholder,
  showLabel,
  isLoading = false,
  value,
  onChange,
  ...props
}: ITimeTextField) => {
  return !isLoading ? (
    <div className="flex w-full flex-col justify-center gap-y-1">
      {showLabel && (
        <label htmlFor="timeInput" className="text-sm font-[500] dark:text-white">
          {placeholder}
        </label>
      )}
      <input
        id="timeInput"
        type="time"
        className={`h-10 w-full dark:text-white rounded-lg border border-gray-300 px-8 text-sm outline-none focus:shadow-none focus:outline-none ${className}`}
        placeholder={placeholder}
        // 'HH:MM' format
        value={value ?? ''}
        onChange={(e) => {
          onChange(e.target.value); // Pass the time string "HH:MM"
        }}
        {...props}
      />
    </div>
  ) : (
    <TimeInputSkeleton />
  );
};

export default CustomTimeInput;
