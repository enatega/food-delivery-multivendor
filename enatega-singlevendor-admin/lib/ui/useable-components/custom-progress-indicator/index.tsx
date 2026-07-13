// React import
import React from 'react';

// Third-party imports
import { ProgressSpinner } from 'primereact/progressspinner';

// Local imports
import { CustomProgressIndicatorComponentProps } from '@/lib/utils/interfaces';

const CustomLoader: React.FC<CustomProgressIndicatorComponentProps> = ({
  size = '20px',
  strokeWidth = '5', // Changed to a static color (white)
  animationDuration = '.5s',
}) => {
  return (
    <ProgressSpinner
      style={{ width: size, height: size, color: 'green' }}
      strokeWidth={strokeWidth}
      fill={'transparent'}
      animationDuration={animationDuration}
    />
  );
};

export default CustomLoader;
