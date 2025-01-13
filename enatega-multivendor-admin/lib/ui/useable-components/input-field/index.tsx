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
  ...props
}: ITextFieldProps) {
  return !isLoading ? (
    <div className={`flex w-full flex-col justify-center gap-y-1`}>
      {showLabel && (
        <label htmlFor="username" className="text-sm font-[500]">
          {placeholder}
        </label>
      )}

      <InputText
        className={`h-10 w-full rounded-lg border border-gray-300 px-2 text-sm focus:shadow-none focus:outline-none ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  ) : (
    <InputSkeleton />
  );
}
