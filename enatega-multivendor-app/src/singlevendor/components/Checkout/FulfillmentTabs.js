import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const FulfillmentTabs = ({ selectedMode, onSelectMode }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const handleModeSelect = (mode) => {
    console.log('🚚 Fulfillment Mode Selected:', mode === 'delivery' ? 'Delivery' : 'Click & Collect');
    onSelectMode(mode);
  };

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).tabsContainer}>
        <TouchableOpacity
          style={[
            styles(currentTheme).tab,
            selectedMode === 'delivery' && styles(currentTheme).tabSelected
          ]}
          onPress={() => handleModeSelect('delivery')}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={selectedMode === 'delivery' ? currentTheme.fontMainColor : currentTheme.fontSecondColor}
            bold
            bolder={selectedMode === 'delivery'}
            isRTL
          >
            {t('Delivery') || 'Delivery'}
          </TextDefault>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles(currentTheme).tab,
            selectedMode === 'collection' && styles(currentTheme).tabSelected
          ]}
          onPress={() => handleModeSelect('collection')}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={selectedMode === 'collection' ? currentTheme.fontMainColor : currentTheme.fontSecondColor}
            bold
            bolder={selectedMode === 'collection'}
            isRTL
          >
            {t('Click & Collect') || 'Click & Collect'}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingTop: scale(16),
      paddingBottom: scale(8)
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: props !== null ? props.gray100 : '#F3F4F6',
      borderRadius: scale(8),
      padding: scale(4)
    },
    tab: {
      flex: 1,
      paddingVertical: scale(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(6)
    },
    tabSelected: {
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    }
  });

export default FulfillmentTabs;
