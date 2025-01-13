// Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Interfaces
import { ICuisineScreenHeaderProps } from '@/lib/utils/interfaces/cuisine.interface';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';

export default function CuisineScreenHeader({
  handleButtonClick,
}: ICuisineScreenHeaderProps) {
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text="Cuisines" />
        <TextIconClickable
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          onClick={handleButtonClick}
          title="Add Cuisines"
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
        />
      </div>
    </div>
  );
}
