import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../../utils/themeColors';
import { scale } from '../../../../utils/scaling';
import TextDefault from '../../../../components/Text/TextDefault/TextDefault';

const ContactCourierCard = ({ onPress, contactlessDelivery = true }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <TouchableOpacity 
      style={styles(currentTheme).container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles().leftSection}>
        <MaterialCommunityIcons 
          name="message-text-outline" 
          size={22} 
          color={currentTheme.fontMainColor} 
        />
        <View style={styles().content}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bold
            isRTL
          >
            {t('Contact your courier') || 'Contact your courier'}
          </TextDefault>
          {contactlessDelivery && (
            <TextDefault
              textColor={currentTheme.gray500}
              small
              isRTL
            >
              {t('Ask for contactless delivery') || 'Ask for contactless delivery'}
            </TextDefault>
          )}
        </View>
      </View>
      <Feather 
        name="chevron-right" 
        size={20} 
        color={currentTheme.fontMainColor} 
      />
    </TouchableOpacity>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: props?.gray200 || '#E5E7EB'
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    content: {
      marginLeft: scale(12)
    }
  });

export default ContactCourierCard;
