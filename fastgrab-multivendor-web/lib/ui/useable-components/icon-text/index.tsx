import { IIconTextProps } from "@/lib/utils/interfaces/icon.text.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";



const IconText: React.FC<IIconTextProps> = ({ icon, text, className, iconClassName }) => {
  return (
    <div className={twMerge("flex items-center", className)}>
      <FontAwesomeIcon icon={icon} className={twMerge("mr-1", iconClassName)} />
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
};

export default IconText;
