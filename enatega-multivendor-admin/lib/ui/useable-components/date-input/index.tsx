import { IDateTextField } from '@/lib/utils/interfaces';
import TimeInputSkeleton from '../custom-skeletons/time-inputfield.skeleton';

const CustomDateInput = ({
  className,
  placeholder,
  showLabel,
  isLoading = false,
  value,
  onChange,
  ...props
}: IDateTextField) => {
  return !isLoading ? (
    <div className="flex w-full flex-col justify-center gap-y-1">
      {showLabel && (
        <label htmlFor="timeInput" className="text-sm font-[500]">
          {placeholder}
        </label>
      )}
      <input
        id="timeInput"
        type="date"
        className={`h-10 w-full rounded-lg border border-gray-300 dark:border-dark-600 px-8 text-sm outline-none focus:shadow-none focus:outline-none ${className}`}
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

export default CustomDateInput;
