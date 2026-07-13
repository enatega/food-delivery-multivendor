import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const TimeSlotList = ({ timeSlots, selectedTimeSlot, onSelectTimeSlot }) => {
  const { i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      {timeSlots.map((slot) => {
        const isSelected = selectedTimeSlot?.id === slot.id;
        
        return (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles(currentTheme).timeSlotButton,
              isSelected && styles(currentTheme).timeSlotButtonSelected
            ]}
            onPress={() => onSelectTimeSlot(slot)}
            activeOpacity={0.7}
          >
            <TextDefault
              textColor={isSelected ? (currentTheme.singlevendorcolor || '#0090CD') : currentTheme.fontSecondColor}
              bolder
              // bolder={isSelected}
              center
              isRTL
            >
              {slot.time}
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
      paddingHorizontal: scale(16),
      paddingTop: scale(8)
    },
    timeSlotButton: {
      paddingVertical: scale(16),
      paddingHorizontal: scale(16),
      marginBottom: scale(12),
      borderRadius: scale(24),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    timeSlotButtonSelected: {
      backgroundColor: props !== null ? props.colorBgSecondary : '#CCE9F5',
      borderColor: props !== null ? props.singlevendorcolor : '#0090CD',
      borderWidth: 1
    }
  });

export default TimeSlotList;
