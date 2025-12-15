import { IPasswordTextFieldProps } from '@/lib/utils/interfaces';
import { Password } from 'primereact/password';
import { twMerge } from 'tailwind-merge';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';
import PasswordFeedback from './password-feedback';
import { useTranslations } from 'next-intl';

export default function CustomPasswordTextField({
  className,
  placeholder,
  showLabel,
  feedback = true,
  isLoading = false,
  ...props
}: IPasswordTextFieldProps) {
  const t = useTranslations()
  return !isLoading ? (
    <div className="flex flex-col gap-y-1 rounded-lg">
      {showLabel && (
        <label htmlFor="username" className="text-sm font-[500]">
          {placeholder}
        </label>
      )}
      <Password
        className={twMerge(
          `icon-right h-10 w-full rounded-lg border border-gray-300 dark:border-dark-600 border-inherit pr-8 text-sm focus:shadow-none focus:outline-none`,
          className
        )}
        placeholder={placeholder}
        toggleMask
        promptLabel={t("enter_password.enter_a_password")}
        weakLabel={t("enter_password.weak")}
        strongLabel={t("enter_password.strong")}
        mediumLabel={t("enter_password.medium")}
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
