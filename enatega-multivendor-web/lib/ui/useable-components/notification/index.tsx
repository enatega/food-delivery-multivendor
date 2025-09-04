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
    <div className="flex h-full w-full">
      <div
        className={`w-[0.5rem] rounded-bl-lg rounded-tl-lg`}
        style={{ backgroundColor: styles.textColor }}
      >
        <FontAwesomeIcon
          icon={styles.icon}
          size="2xl"
          color={styles.textColor}
          className="m-4 ml-4 rtl:mr-4"
        />
      </div>

      <div className="m-4 ml-14 rtl:mr-4">
        <div className={`font-semibold ${styles.textColor}`}>{title}</div>
        <div className={`text-sm font-[400] ${styles.textColor}`}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default CustomNotification;
