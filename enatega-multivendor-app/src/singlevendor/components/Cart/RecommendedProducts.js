import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import ProductCard from '../ProductCard';
import { useTranslation } from 'react-i18next';
import useGetRecommendedFoods from './useGetRecommendedProducts';
import HorizontalProductsList from '../HorizontalProductsList';

const RecommendedProducts = ({ cartItemId }) => {
  const { data, loading } = useGetRecommendedFoods({ foodId: cartItemId })

  console.log("recommended list data", data?.getRecommendedFoods?.items)
  if (!loading && data?.getRecommendedFoods?.items?.length === 0 || !data) {
    return null
  }

  return <HorizontalProductsList showSeeAll={false} listTitle='Recommended for you' ListData={data?.getRecommendedFoods?.items} isLoading={loading} containerStyles={{ paddingHorizontal: 0 }} />

};

export default React.memo(RecommendedProducts);
