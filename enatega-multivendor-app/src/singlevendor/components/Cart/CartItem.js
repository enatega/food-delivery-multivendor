import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { useTranslation } from 'react-i18next';
import styles from './styles';

const CartItem = ({ 
  item, 
  onAddQuantity, 
  onRemoveQuantity, 
  currencySymbol = '€',
  onEdit,
  isLastItem = false
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);

  return (
    <View style={[
      styles(currentTheme).itemContainer,
      isLastItem && styles().itemContainerLast
    ]}>
      {/* Left side: Image */}
      <View style={styles().imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles().productImage}
        />
      </View>

      {/* Middle and Right: Content */}
      <View style={styles().mainContent}>
        {/* Top Row: Title only */}
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontMainColor}
          bolder
          H5
          isRTL
        >
          {item.title}
        </TextDefault>

        {/* Middle Row: Description with Dropdown - single line */}
        <TouchableOpacity
          onPress={toggleDropdown}
          activeOpacity={0.7}
          style={styles().descriptionRow}
        >
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontMainColor}
            small
            isRTL
            style={styles().descriptionText}
          >
            {item.description}
          </TextDefault>
          {item?.addons && item.addons.length > 0 && (
            <Feather
              name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={currentTheme.fontMainColor}
            />
          )}
        </TouchableOpacity>

        {/* Expanded Addons */}
        {isDropdownOpen && item?.addons && item.addons.length > 0 && (
          <View style={styles().itemsDropdown}>
            {item.addons.map((addon, index) => (
              <TextDefault
                key={index}
                textColor={currentTheme.fontSecondColor}
                small
                isRTL
              >
                • {addon}
              </TextDefault>
            ))}
          </View>
        )}

        {/* Bottom Row: Quantity Controls (left) and Price (right) */}
        <View style={styles().bottomRow}>
          <View style={styles(currentTheme).quantityControls}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).quantityButton}
              onPress={onRemoveQuantity}
            >
              {item?.quantity < 2 ? (
                <AntDesign
                  name='delete'
                  size={16}
                  color={currentTheme.fontMainColor}
                />
              ) : (
                <AntDesign
                  name='minus'
                  size={16}
                  color={currentTheme.fontMainColor}
                />
              )}
            </TouchableOpacity>

            <TextDefault 
              H5 
              bold 
              textColor={currentTheme.fontMainColor} 
              isRTL
              style={styles().quantityText}
            >
              {item?.quantity}
            </TextDefault>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).quantityButton}
              onPress={onAddQuantity}
            >
              <AntDesign 
                name='plus' 
                size={16} 
                color={currentTheme.fontMainColor} 
              />
            </TouchableOpacity>
          </View>

          <TextDefault
            textColor={currentTheme.gray}
            bold
            isRTL
          >
            {currencySymbol} {itemTotal}
          </TextDefault>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
