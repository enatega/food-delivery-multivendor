import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/Membership/styles'

const PlanCard = ({ plan, isSelected, onSelect, currentTheme }) => {
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={[
        styles(currentTheme).planCard,
        isSelected && styles(currentTheme).planCardSelected
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      {plan.popular && (
        <View style={styles(currentTheme).popularBadge}>
          <TextDefault
            textColor={currentTheme.white}
            style={styles(currentTheme).popularText}
            bold
          >
            {t('Most popular')}
          </TextDefault>
        </View>
      )}
      
      <View style={styles(currentTheme).planHeader}>
        <View style={styles(currentTheme).planTitleContainer}>
          <TextDefault
            textColor={
              isSelected
                ? currentTheme.colorTextPrimary
                : currentTheme.fontMainColor
            }
            style={styles(currentTheme).planTitle}
            bolder
          >
            {plan.title}
          </TextDefault>
          <TextDefault
            textColor={
              isSelected
                ? currentTheme.colorTextPrimary
                : currentTheme.colorTextMuted
            }
            style={styles(currentTheme).planBilling}
            bold
          >
            {plan.totalPrice} {plan.billingPeriod}
          </TextDefault>
        </View>
        
        <View style={styles(currentTheme).planPriceContainer}>
          <TextDefault
            textColor={
              isSelected
                ? currentTheme.colorTextPrimary
                : currentTheme.fontMainColor
            }
            style={styles(currentTheme).planPrice}
            bold
          >
            {plan.price}
          </TextDefault>
          <TextDefault
            textColor={
              isSelected
                ? currentTheme.colorTextPrimary
                : currentTheme.colorTextMuted
            }
            style={styles(currentTheme).planPeriod}
            bold
          >
            {plan.displayPeriod}
          </TextDefault>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PlanCard
