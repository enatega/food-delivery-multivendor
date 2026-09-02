'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [icon, setIcon] = useState(faSun);

  useEffect(() => {
    setIcon(theme === 'dark' ? faMoon : faSun);
  }, [theme]);

  return (
    <div
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837] cursor-pointer transition-all duration-200"
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-lg transition-colors duration-300 ${
          theme === 'dark' ? 'text-yellow-400' : 'text-orange-400'
        }`}
      />
    </div>
  );
}
