import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import ProductCard from '../ProductCard';
import { useTranslation } from 'react-i18next';

const RecommendedProducts = ({ products = [], onAddToCart, onProductPress }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault 
        textColor={currentTheme.fontMainColor} 
        bolder 
        H4
        style={{ marginBottom: scale(12) }}
      >
        {t('recommendedForYou') || 'Recommended for you'}
      </TextDefault>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles().scrollContent}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            onAddToCart={() => onAddToCart && onAddToCart(product)}
            onCardPress={() => onProductPress && onProductPress(product)}
            containerStyles={{ marginRight: scale(12) }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = (currentTheme = null) =>
  StyleSheet.create({
    container: {
      paddingVertical: scale(16),
      backgroundColor: currentTheme ? currentTheme.themeBackground : '#fff',
      overflow: 'visible'
    },
    scrollContent: {
      paddingRight: scale(20),
      paddingBottom: scale(10),
      paddingTop: scale(5)
    }
  });

export default RecommendedProducts;
