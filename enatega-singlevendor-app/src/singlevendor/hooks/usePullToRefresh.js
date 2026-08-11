import { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../ui/ThemeContext/ThemeContext';
import { theme } from '../../utils/themeColors';

export const usePullToRefresh = (onRefreshFunctions = []) => {
  const { i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await Promise.all(
        onRefreshFunctions.map(fn => {
          if (typeof fn === 'function') return fn();
          return Promise.resolve();
        })
      );
    } catch (error) {
      console.log('🚀 ~ handleRefresh ~ error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshFunctions, refreshing]);

  return {
    refreshing,
    handleRefresh,
    spinnerColor: currentTheme.primaryBlue,
    color: currentTheme.themeBackground
  };
};