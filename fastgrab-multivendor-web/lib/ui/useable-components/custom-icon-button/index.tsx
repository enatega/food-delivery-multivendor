import { IGlobalButtonProps } from "@/lib/utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { twMerge } from "tailwind-merge";
export default function CustomIconButton({
  Icon,
  title,
  handleClick,
  SvgIcon,
  iconColor="white",
  loading,
  classNames
}: IGlobalButtonProps) {
  return (
    <Button
    loading={loading}
    className={twMerge("bg-white flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-2 m-auto w-72",
      classNames
     )}
      onClick={handleClick}
    >
      {SvgIcon ?
        <SvgIcon width={30} height={30} />
      : <span>
          {!!Icon && <FontAwesomeIcon icon={Icon} size="1x" color={iconColor} />}
        </span>
      }
      <span className="text-xs lg:text-sm">{title}</span>
    </Button>
  );
}
