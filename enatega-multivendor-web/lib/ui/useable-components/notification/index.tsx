import { SEVERITY_STYLES } from '@/lib/utils/constants';
import { IToastNotificationComponentProps } from '@/lib/utils/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomNotification = ({
  type,
  title,
  message,
}: IToastNotificationComponentProps) => {
  const styles = SEVERITY_STYLES[type];

  return (
    <div className="flex w-full items-start">
      <div className="w-1.5" style={{ backgroundColor: styles.textColor }} />

      <div className="flex items-start gap-3 p-3 w-full">
        <FontAwesomeIcon
          icon={styles.icon}
          className="text-[18px] mt-0.5"
          style={{ color: styles.textColor }}
        />
        <div className="flex-1">
          <div
            className="font-inter font-semibold text-base"
            style={{ color: styles.textColor }}
          >
            {title}
          </div>
          <div
            className="font-inter text-sm leading-5 break-words"
            style={{ color: styles.textColor }}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNotification;
