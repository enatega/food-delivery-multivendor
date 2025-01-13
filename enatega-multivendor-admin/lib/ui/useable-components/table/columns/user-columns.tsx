// Interfaces and Types
import { IUserResponse } from '@/lib/utils/interfaces/users.interface';

// Icons
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const USERS_TABLE_COLUMNS = [
  {
    headerName: 'Name',
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
  { headerName: 'Email', propertyName: 'email' },
  { headerName: 'Phone', propertyName: 'phone' },
  {
    headerName: 'Created At',
    propertyName: 'createdAt',
    body: (user: IUserResponse) => {
      const formattedDate = new Date(Number(user.createdAt)).toLocaleDateString(
        'en-GB'
      );
      return <div className="flex items-center gap-2">{formattedDate}</div>;
    },
  },
];
