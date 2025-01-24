// Core
import { useState } from 'react';

// Components
import OptionsAddForm from '@/lib/ui/screen-components/protected/restaurant/options/add-form';
import OptionsHeader from '@/lib/ui/screen-components/protected/restaurant/options/view/header/screen-header';
import OptionsMain from '@/lib/ui/screen-components/protected/restaurant/options/view/main';

// Interfaces and Types
import { IOptions } from '@/lib/utils/interfaces/options.interface';

export default function OptionsScreen() {
  // State
  const [isAddOptionsVisible, setIsAddOptionsVisible] = useState(false);
  const [option, setOption] = useState<IOptions | null>(null);

  return (
    <div className="screen-container">
      <OptionsHeader setIsAddOptionsVisible={setIsAddOptionsVisible} />

      <OptionsMain
        setIsAddOptionsVisible={setIsAddOptionsVisible}
        setOption={setOption}
      />

      <OptionsAddForm
        option={option}
        onHide={() => {
          setIsAddOptionsVisible(false);
          setOption(null);
        }}
        isAddOptionsVisible={isAddOptionsVisible}
      />
    </div>
  );
}
