import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const DeliveryTimeOptions = ({ selectedTime, onSelectTime, mode = 'delivery' }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const timeOptions = [
    {
      id: 'priority',
      title: mode === 'delivery' 
        ? (t('Priority delivery for +€1.99') || 'Priority delivery for +€1.99')
        : (t('Priority collection for +€1.99') || 'Priority collection for +€1.99'),
      subtitle: '10-20 min'
    },
    {
      id: 'standard',
      title: t('Standard') || 'Standard',
      subtitle: '10-20 min'
    },
    {
      id: 'schedule',
      title: t('Schedule') || 'Schedule',
      subtitle: mode === 'delivery'
        ? (t('Choose a delivery time') || 'Choose a delivery time')
        : (t('Choose a collection time') || 'Choose a collection time')
    }
  ];

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        bolder
        H4
        isRTL
        style={styles().sectionTitle}
      >
        {mode === 'delivery' 
          ? (t('Delivery Time') || 'Delivery Time')
          : (t('Collection Time') || 'Collection Time')}
      </TextDefault>

      {timeOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles(currentTheme).optionCard,
            selectedTime === option.id && styles(currentTheme).optionCardSelected
          ]}
          onPress={() => onSelectTime(option.id)}
          activeOpacity={0.7}
        >
          <View style={styles().radioButton}>
            <View style={[
              styles(currentTheme).radioOuter,
              selectedTime === option.id && styles(currentTheme).radioOuterSelected
            ]}>
              {selectedTime === option.id && (
                <View style={styles(currentTheme).radioInner} />
              )}
            </View>
          </View>

          <View style={styles().optionContent}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              bolder={selectedTime === option.id}
              isRTL
            >
              {option.title}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              small
              isRTL
            >
              {option.subtitle}
            </TextDefault>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(16)
    },
    sectionTitle: {
      marginBottom: scale(12)
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(8),
      paddingHorizontal: scale(16),
      marginBottom: scale(8),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    optionCardSelected: {
      borderColor: props !== null ? props.primaryBlue : '#0EA5E9',
      borderWidth: 2
    },
    radioButton: {
      marginRight: scale(12)
    },
    radioOuter: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: props !== null ? props.gray300 : '#D1D5DB',
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioOuterSelected: {
      borderColor: props !== null ? props.primaryBlue : '#0EA5E9'
    },
    radioInner: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9'
    },
    optionContent: {
      flex: 1
    }
  });

export default DeliveryTimeOptions;
