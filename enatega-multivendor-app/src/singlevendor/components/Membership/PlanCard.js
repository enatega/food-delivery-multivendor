import React, { useContext, useMemo } from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/Membership/styles'

const PlanCard = ({ plan, isSelected, onSelect, currentTheme, configurations, onCancel, isActive }) => {
  const { t } = useTranslation()

  // Determine period label based on intervalCount and interval
  const getPeriodLabel = () => {
    if (plan.interval === 'month' && plan.intervalCount === 12) {
      return t('Yearly');
    } else if (plan.interval === 'month' && plan.intervalCount === 1) {
      return t('Monthly');
    }
    return `${plan.intervalCount} ${plan.interval}`;
  };

  const periodLabel = getPeriodLabel();
  
  return (
    <TouchableOpacity style={[styles(currentTheme).planCard, isSelected && styles(currentTheme).planCardSelected]} onPress={onSelect} activeOpacity={0.7}>
      {plan.popular && (
        <View style={styles(currentTheme).popularBadge}>
          <TextDefault textColor={currentTheme.white} style={styles(currentTheme).popularText} bold>
            {t('Most popular')}
          </TextDefault>
        </View>
      )}

      {isActive && (
        <View style={styles(currentTheme).popularBadge}>
          <TextDefault textColor={currentTheme.white} style={styles(currentTheme).popularText} bold>
            {t('Currently Active')}
          </TextDefault>
        </View>
      )}

      {!isActive && plan.discountPercent > 0 && (
        <View style={styles(currentTheme).popularBadge}>
          <TextDefault textColor={currentTheme.white} style={styles(currentTheme).popularText} bold>
            {t('spare')} {plan.discountPercent}%
          </TextDefault>
        </View>
      )}

      <View style={styles(currentTheme).planHeader}>
        <View style={styles(currentTheme).planTitleContainer}>
          <TextDefault textColor={isSelected ? currentTheme.colorTextPrimary : currentTheme.fontMainColor} style={styles(currentTheme).planTitle} bolder>
            {plan.productName}
          </TextDefault>
          <TextDefault textColor={isSelected ? currentTheme.colorTextPrimary : currentTheme.colorTextMuted} style={styles(currentTheme).planBilling}>
            {(plan?.amount)?.toFixed(2)}&nbsp;
             {configurations?.currencySymbol} {t('billed')} <TextDefault bold style={{fontWeight: 'bold'}}>{periodLabel}</TextDefault>
          </TextDefault>
        </View>

        <View style={styles(currentTheme).planPriceContainer}>
          <TextDefault textColor={isSelected ? currentTheme.colorTextPrimary : currentTheme.fontMainColor} style={styles(currentTheme).planPrice} bold>
            {(plan?.amount)?.toFixed(2)}&nbsp;
            {configurations?.currencySymbol}
          </TextDefault>
          <TextDefault textColor={isSelected ? currentTheme.colorTextPrimary : currentTheme.colorTextMuted} style={styles(currentTheme).planPeriod} bold>
           {periodLabel}
          </TextDefault>
        </View>
      </View>
      {isActive && (
        <View style={{alignItems: 'flex-start', width: '100%'}}>
          <Pressable onPress={() => onCancel()} style={styles(currentTheme).cancelButton}>
            <TextDefault textColor={currentTheme.white} bold>{t("Cancel subscription")}</TextDefault>
          </Pressable>
          </View>
      )}
    </TouchableOpacity>
  )
}

export default PlanCard
