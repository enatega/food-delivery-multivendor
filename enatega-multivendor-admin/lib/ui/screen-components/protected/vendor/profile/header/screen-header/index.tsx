// Custom Components
import HeaderText from '@/lib/ui/useable-components/header-text';

const ProfileHeader: React.FC = () => {
  return (
    <div className="top-0 z-10 w-full flex-shrink-0 bg-white p-3 shadow-sm">
      <div className="flex w-full justify-between">
        <HeaderText className="heading" text="Profile" />
      </div>
    </div>
  );
};

export default ProfileHeader;
