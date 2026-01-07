import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../../utils/themeColors';
import { scale } from '../../../../utils/scaling';
import TextDefault from '../../../../components/Text/TextDefault/TextDefault';

const DeliveryDetailsCard = ({ 
  addressLabel = 'Home',
  address,
  showMap = false,
  mapComponent,
  onToggleMap
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const [expanded, setExpanded] = useState(showMap);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggleMap?.(!expanded);
  };

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        H5
        bolder
        isRTL
        style={styles().sectionTitle}
      >
        {t('Delivery details') || 'Delivery details'}
      </TextDefault>

      <TouchableOpacity 
        style={styles().addressRow}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles().addressLeft}>
          <MaterialIcons 
            name="home" 
            size={22} 
            color={currentTheme.fontMainColor} 
          />
          <View style={styles().addressContent}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              isRTL
            >
              {addressLabel}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.gray500}
              small
              bold
              isRTL
              numberOfLines={1}
            >
              {address}
            </TextDefault>
          </View>
        </View>
        <Feather 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={currentTheme.fontMainColor} 
        />
      </TouchableOpacity>

      {expanded && mapComponent && (
        <View style={styles().mapContainer}>
          {mapComponent}
        </View>
      )}
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: props?.gray200 || '#E5E7EB'
    },
    sectionTitle: {
      marginBottom: scale(16)
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    addressLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    addressContent: {
      marginLeft: scale(12),
      flex: 1,
      gap: scale(6)

    },
    mapContainer: {
      marginTop: scale(16),
      borderRadius: scale(12),
      overflow: 'hidden',
      height: scale(180)
    }
  });

export default DeliveryDetailsCard;
