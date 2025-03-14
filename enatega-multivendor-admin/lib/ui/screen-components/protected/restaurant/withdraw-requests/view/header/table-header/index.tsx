// CSS
import classes from './table-header.module.css'

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IWithdrawRequestsTableHeaderProps } from '@/lib/utils/interfaces/withdraw-request.interface';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';

// Prime react
import { Checkbox } from 'primereact/checkbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
  type: 'status' | 'userType';
}

export default function WithdrawRequestAdminTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IWithdrawRequestsTableHeaderProps) {
  // Refs
  const statusOverlayRef = useRef<OverlayPanel>(null);
  const userTypeOverlayRef = useRef<OverlayPanel>(null);

  // States
  const [searchValue, setSearchValue] = useState('');


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
