import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../../utils/themeColors';
import { scale } from '../../../../utils/scaling';
import TextDefault from '../../../../components/Text/TextDefault/TextDefault';

const OrderItemRow = ({ item, currencySymbol, currentTheme, isExpanded }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isExpanded) return null;

  return (
    <TouchableOpacity 
      style={styles(currentTheme).itemRow}
      onPress={() => setShowDetails(!showDetails)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles().itemImage} 
      />
      <View style={styles().itemContent}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          bold
          isRTL
          numberOfLines={1}
        >
          {item.title}
        </TextDefault>
        <TextDefault
          textColor={currentTheme.gray500}
          small
          isRTL
          numberOfLines={showDetails ? undefined : 1}
        >
          {item.description}
        </TextDefault>
        <TextDefault
          textColor={currentTheme.gray500}
          small
          isRTL
        >
          Qty {item.quantity}
        </TextDefault>
      </View>
      <View style={styles().itemRight}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          isRTL
        >
          {currencySymbol} {(item.price * item.quantity).toFixed(2)}
        </TextDefault>
        <Feather 
          name={showDetails ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color={currentTheme.gray400} 
        />
      </View>
    </TouchableOpacity>
  );
};

const OrderItemsSection = ({ 
  items = [], 
  currencySymbol = '€',
  initialExpanded = false 
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const [expanded, setExpanded] = useState(initialExpanded);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const displayImages = items.slice(0, 3);
  const remainingCount = totalItems - displayImages.length;

  const getItemsSummary = () => {
    const names = items.map(item => item.title).join(' + ');
    return names.length > 30 ? names.substring(0, 30) + '...' : names;
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
        {t('Order items') || 'Order items'}
      </TextDefault>

      {/* Collapsed View - Image Stack */}
      <TouchableOpacity 
        style={styles().collapsedRow}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles().imageStack}>
          {displayImages.map((item, index) => (
            <Image
              key={index}
              source={{ uri: item.image }}
              style={[
                styles().stackedImage,
                { marginLeft: index > 0 ? -scale(12) : 0, zIndex: displayImages.length - index }
              ]}
            />
          ))}
          {remainingCount > 0 && (
            <View style={[styles(currentTheme).remainingBadge, { marginLeft: -scale(12) }]}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                small
                bold
              >
                +{remainingCount}
              </TextDefault>
            </View>
          )}
        </View>
        <View style={styles().summaryContent}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            isRTL
            numberOfLines={1}
            style={styles().summaryText}
          >
            {getItemsSummary()}
          </TextDefault>
        </View>
        <Feather 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={currentTheme.fontMainColor} 
        />
      </TouchableOpacity>

      {/* Expanded View - Item List */}
      {expanded && (
        <View style={styles().itemsList}>
          {items.map((item, index) => (
            <OrderItemRow
              key={item.id || index}
              item={item}
              currencySymbol={currencySymbol}
              currentTheme={currentTheme}
              isExpanded={true}
            />
          ))}
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
      marginBottom: scale(12)
    },
    collapsedRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    imageStack: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    stackedImage: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      borderWidth: 2,
      borderColor: '#fff'
    },
    remainingBadge: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: props?.gray100 || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#fff'
    },
    summaryContent: {
      flex: 1,
      marginLeft: scale(12)
    },
    summaryText: {
      flex: 1
    },
    itemsList: {
      marginTop: scale(16)
    },
    itemRow: {
      flexDirection: 'row',
      paddingVertical: scale(12),
      borderTopWidth: 1,
      borderTopColor: props?.gray100 || '#F3F4F6'
    },
    itemImage: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(8)
    },
    itemContent: {
      flex: 1,
      marginLeft: scale(12)
    },
    itemRight: {
      alignItems: 'flex-end'
    }
  });

export default OrderItemsSection;
