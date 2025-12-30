import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const DateSelector = ({ dates, selectedDate, onSelectDate }) => {
  const { i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      {dates.map((date) => {
        const isSelected = selectedDate.id === date.id;
        return (
          <TouchableOpacity
            key={date.id}
            style={[
              styles(currentTheme).dateButton,
              isSelected && styles(currentTheme).dateButtonSelected
            ]}
            onPress={() => onSelectDate(date)}
            activeOpacity={0.7}
          >
            <TextDefault
              textColor={isSelected ? currentTheme.fontMainColor : currentTheme.fontSecondColor}
              bold={isSelected}
              isRTL
            >
              {date.label}, {date.date}
            </TextDefault>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      gap: scale(12)
    },
    dateButton: {
      flex: 1,
      paddingVertical: scale(12),
      paddingHorizontal: scale(16),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dateButtonSelected: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      borderColor: props !== null ? props.fontMainColor : '#000',
      borderWidth: 2
    }
  });

export default DateSelector;
