// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { IZoneHeaderProps } from '@/lib/utils/interfaces';

const ZoneHeader = ({ onSetAddFormVisible }: IZoneHeaderProps) => {
  return (
    <div className="w-full flex-shrink-0">
      <div className="flex w-full justify-between">
        <HeaderText text="Zone" />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title="Add Zone"
          onClick={() => onSetAddFormVisible()}
        />
      </div>
    </div>
  );
};

export default ZoneHeader;
