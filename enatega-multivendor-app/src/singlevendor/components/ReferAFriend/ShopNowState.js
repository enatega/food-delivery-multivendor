import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/ReferAFriend/styles'

const ShopNowState = ({ currentTheme, onStartShopping }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).contentContainer}>
      <View style={styles(currentTheme).illustrationContainer}>
        <Image
          source={require('../../assets/images/refer-a-friend-1.png')}
          style={styles(currentTheme).illustration}
          resizeMode="contain"
        />
      </View>

      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).title}
        bolder
        H5
      >
        {t('Shop now, refer later')}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).description}
        center
        bold
      >
        {t('You need to have placed at least one order with FAST before you can invite friends.')}
      </TextDefault>

      <TouchableOpacity
        style={styles(currentTheme).primaryButton}
        onPress={onStartShopping}
        activeOpacity={0.7}
      >
        <TextDefault
          textColor={currentTheme.colorTextPrimary}
          style={styles(currentTheme).buttonText}
          bold
        >
          {t('Start shopping')}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

export default ShopNowState
