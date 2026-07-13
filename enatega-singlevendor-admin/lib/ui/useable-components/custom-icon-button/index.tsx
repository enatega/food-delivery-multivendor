import { IGlobalButtonProps } from '@/lib/utils/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
export default function CustomIconButton({
  Icon,
  title,
  setVisible,
}: IGlobalButtonProps) {
  return (
    <Button
      className="flex items-center justify-center gap-3 rounded-md bg-black px-3 py-2 hover:bg-[#272727]"
      onClick={() => setVisible(true)}
    >
      <span>
        <FontAwesomeIcon icon={Icon} size="1x" color="white" />
      </span>
      <span className="text-white">{title}</span>
    </Button>
  );
}
