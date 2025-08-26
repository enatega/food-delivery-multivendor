//Components
import HeaderText from '@/lib/ui/useable-components/header-text';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { IWithDrawRequestAdminHeaderProps } from '@/lib/utils/interfaces/withdraw-request.interface';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

export default function WithdrawRequestAdminHeader({
  setIsAddWithdrawRequestVisible,
}: IWithDrawRequestAdminHeaderProps) {
  return (
    <div className="sticky top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText text="Withdraw Requests" />
        <TextIconClickable
          className="rounded border-gray-300 bg-black text-white sm:w-auto"
          icon={faAdd}
          iconStyles={{ color: 'white' }}
          title="Withdraw Money"
          onClick={() => setIsAddWithdrawRequestVisible(true)}
        />
      </div>
    </div>
  );
}
