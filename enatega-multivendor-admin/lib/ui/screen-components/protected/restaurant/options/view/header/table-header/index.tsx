// Custom Components
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { ICategoryTableHeaderProps } from '@/lib/utils/interfaces';

export default function OptionTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: ICategoryTableHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-6">
      <div className="flex-colm:flex-row flex w-fit items-center gap-2">
        <div className="w-60">
          <CustomTextField
            type="text"
            name="categoryilter"
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
