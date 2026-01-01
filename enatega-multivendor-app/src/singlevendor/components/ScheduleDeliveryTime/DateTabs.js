import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const DateTabs = ({ dates, selectedDate, onSelectDate }) => {
  const { i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).tabsContainer}>
        {dates.map((date) => (
          <TouchableOpacity
            key={date.id}
            style={[
              styles(currentTheme).tab,
              selectedDate.id === date.id && styles(currentTheme).tabSelected
            ]}
            onPress={() => onSelectDate(date)}
            activeOpacity={0.7}
          >
            <TextDefault
              textColor={selectedDate.id === date.id ? currentTheme.fontMainColor : currentTheme.fontSecondColor}
              bold
              bolder={selectedDate.id === date.id}
              isRTL
            >
              {date.label}
            </TextDefault>
          </TouchableOpacity>
        ))}
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

export default DateTabs;
