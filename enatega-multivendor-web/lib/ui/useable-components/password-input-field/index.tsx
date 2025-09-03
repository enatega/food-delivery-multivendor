import { IPasswordTextFieldProps } from '@/lib/utils/interfaces';
import { Password } from 'primereact/password';
import { twMerge } from 'tailwind-merge';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';
import PasswordFeedback from './password-feedback';

export default function CustomPasswordTextField({
  className,
  placeholder,
  showLabel,
  feedback = true,
  isLoading = false,
  ...props
}: IPasswordTextFieldProps) {
  return !isLoading ? (
    <div className="flex flex-col gap-y-1 rounded-lg dark:bg-gray-800">
      {showLabel && (   
        <label htmlFor="username" className="text-sm font-[500] dark:text-white">
          {placeholder}
        </label>
      )}
      <Password
        className={twMerge(
          `icon-right h-10 w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white border-gray-300 border-inherit pr-8 text-sm focus:shadow-none focus:outline-none`,
          className
        )}
        inputClassName="bg-white text-black dark:bg-gray-800 dark:text-white"
        panelClassName="bg-white text-black dark:bg-gray-800 dark:text-white"
        placeholder={placeholder}
        toggleMask
        strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$"
        feedback={feedback}
        footer={feedback ? <PasswordFeedback /> : null}
        
        {...props}
      />
    </div>
  ) : (
    <InputSkeleton />
  );
}
