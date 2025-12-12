// Interfaces
import { ITextFieldProps } from '@/lib/utils/interfaces';

// Prime React
import { InputText } from 'primereact/inputtext';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';

export default function CustomTextField({
  className,
  placeholder,
  showLabel,
  isLoading = false,
  error,
  ...props
}: ITextFieldProps) {
  return !isLoading ? (
    <div className={`flex w-full flex-col justify-center gap-y-1`}>
      {showLabel && (
        <label htmlFor="username" className="text-sm font-[500] dark:text-white">
          {placeholder}
        </label>
      )}

      <InputText
        className={`h-10 w-full rounded-lg border ${error? 'border-red-500': 'border-gray-300'} dark:text-white  px-2 text-sm focus:shadow-none focus:outline-none ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>} 
    </div>
  ) : (
    <InputSkeleton />
  );
}
