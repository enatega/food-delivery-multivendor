// Interface
import { IRippleComponentProps } from '@/lib/utils/interfaces';

// Prime React
import { Ripple } from 'primereact/ripple';

const RippleEffect = ({
  children,
  className = '',
  onClick,
  ...props
}: IRippleComponentProps) => {
  return (
    <div
      className={`ripple-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
      onClick={onClick}
    >
      {children}
      <Ripple />
    </div>
  );
};

export default RippleEffect;
