// Interfaces and Types
import { IUserResponse } from '@/lib/utils/interfaces/users.interface';

// Icons
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';

export const USERS_TABLE_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  return [
    {
      headerName: t('Name'),
      propertyName: 'name',
      body: (user: IUserResponse) => {
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            </div>
            <span>{user.name}</span>
          </div>
        );
      },
    },
    { headerName: t('Email'), propertyName: 'email' },
    { headerName: t('Phone'), propertyName: 'phone' },
    { headerName: t('User ID'), propertyName: '_id' },
    { 
      headerName: t('Registration Method'), 
      propertyName: 'userType',
      body: (user: IUserResponse) => {
        const userType = user.userType || 'default';
        const formattedUserType = {
          google: 'Google',
          apple: 'Apple',
          default: 'Manual'
        }[userType];
        return <div className="flex items-center gap-2">{formattedUserType}</div>;
      },
    },
    { 
      headerName: t('Status'), 
      propertyName: 'status',
      body: (user: IUserResponse) => {
        const status = user.status || 'active';
        const formattedStatus = {
          active: 'Active',
          blocked: 'Blocked',
          deactivate: 'Deactivated'
        }[status];
        return <div className="flex items-center gap-2">{formattedStatus}</div>;
      },
    },
    {
      headerName: t('Created At'),
      propertyName: 'createdAt',
      body: (user: IUserResponse) => {
        const formattedDate = new Date(
          Number(user.createdAt)
        ).toLocaleDateString('en-GB');
        return <div className="flex items-center gap-2">{formattedDate}</div>;
      },
    },
    {
      headerName: t('Last Login'), propertyName: 'lastLogin',
      body: (user: IUserResponse) => {
        const formattedDate = new Date(user.lastLogin ?? "").toLocaleDateString(
          'en-GB'
        );
        return <div className="flex items-center gap-2">{formattedDate}</div>;
      },
    },
  ];
};
