import React, { useContext, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import TextDefault from '../Text/TextDefault/TextDefault';
import ThemeContext from '../../ui/ThemeContext/ThemeContext';
import { theme } from '../../utils/themeColors';
import { useTranslation } from 'react-i18next';
import ErrorSvg from '../../assets/SVG/error';
import useNetworkStatus from '../../utils/useNetworkStatus';

const ErrorView = ({ refetchFunctions = [] }) => {
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  const { t } = useTranslation();
  
  const { isConnected } = useNetworkStatus();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all(refetchFunctions.map((refetch) => refetch()))
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ErrorSvg fill={currentTheme.newIconColor} />
      <TextDefault center H3 bolder textColor={currentTheme.newFontcolor}>
        {t('somethingWentWrong')}
      </TextDefault>
      <TextDefault center H4 textColor={currentTheme.newFontcolor}>
        {t('checkInternet')}
      </TextDefault>
    </ScrollView>
  );
};

export default ErrorView;
