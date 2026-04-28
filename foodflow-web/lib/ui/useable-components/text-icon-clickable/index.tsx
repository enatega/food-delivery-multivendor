import { twMerge } from 'tailwind-merge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextIconClickableProps } from '@/lib/utils/interfaces';
import { Ripple } from 'primereact/ripple';
// PrimeReact Spinner (or any loader component)
import { ProgressSpinner } from 'primereact/progressspinner';

export default function TextIconClickable({
  className,
  icon,
  title = '',
  iconStyles,
  onClick,
  loading = false, // New loading prop
}: TextIconClickableProps) {
  return (
    <div
      className={`text-icon-clickable-container ${twMerge('flex items-center justify-center text-sm', className)}`}
      onClick={onClick}
    >
      {/* Conditionally render the loader or the icon */}
      {loading ? (
        <ProgressSpinner style={{ width: '20px', height: '20px' }} /> // Loader/spinner
      ) : (
        icon && (
          <FontAwesomeIcon
            icon={icon}
            color={iconStyles?.color ?? 'gray'}
            spin={loading}
          />
        )
      )}
      <div className={loading ? 'opacity-50' : ''}>{title}</div>
      <Ripple />
    </div>
  );
}
