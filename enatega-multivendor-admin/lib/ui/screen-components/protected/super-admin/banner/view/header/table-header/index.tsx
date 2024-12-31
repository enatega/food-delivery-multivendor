// Custom Components
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces and Types
import { IBannerTableHeaderProps } from '@/lib/utils/interfaces/banner.interface';


export default function BannerTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IBannerTableHeaderProps) {



  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="vendorFilter"
            maxLength={35}
            showLabel={false}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </div>

      </div>
    </div>
  );
}
