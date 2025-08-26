import UserHeader from '@/lib/ui/screen-components/protected/super-admin/users/view/header/screen-header';
import UsersMain from '@/lib/ui/screen-components/protected/super-admin/users/view/main';

export default function UsersScreen() {
  return (
    <div className="flex h-[90vh] flex-col overflow-auto">
      <UserHeader />

      <UsersMain />
    </div>
  );
}
