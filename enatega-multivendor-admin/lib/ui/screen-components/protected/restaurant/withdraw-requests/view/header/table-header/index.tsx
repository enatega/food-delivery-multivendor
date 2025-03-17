// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import { IWithdrawRequestsTableHeaderProps } from '@/lib/utils/interfaces/withdraw-request.interface';

export default function WithdrawRequestAdminTableHeader({
  globalFilterValue,
  onGlobalFilterChange,
}: IWithdrawRequestsTableHeaderProps) {
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
