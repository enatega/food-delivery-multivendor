import React from 'react'
import { View } from 'react-native'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { GET_MY_FREE_DELIVERIES } from '../../apollo/queries'
import FreeDeliveriesCountSkeleton from './FreeDeliveriesCountSkeleton'
import styles from './styles'

const FreeDeliveriesCountCard = ({ currentTheme, style }) => {
  const { t } = useTranslation()
  const { data, loading } = useQuery(GET_MY_FREE_DELIVERIES)

  const freeDeliveriesCount = data?.getMyFreeDeliveries ?? 0

  if (loading) {
    return (
      <FreeDeliveriesCountSkeleton
        currentTheme={currentTheme}
        style={style}
      />
    )
  }

  return (
    <View style={[styles(currentTheme).card, styles(currentTheme).freeDeliveriesCard, style]}>
      <TextDefault
        textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
        style={styles(currentTheme).label}
      >
        {t('Free deliveries remaining')}
      </TextDefault>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={[styles(currentTheme).amount, styles(currentTheme).freeDeliveriesAmount]}
        bolder
      >
        {freeDeliveriesCount}
      </TextDefault>
    </View>
  )
}

export default FreeDeliveriesCountCard
