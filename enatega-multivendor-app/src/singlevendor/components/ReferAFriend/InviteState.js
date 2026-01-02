import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/ReferAFriend/styles'

const InviteState = ({ currentTheme, referralCode, onCopyCode, onShare }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).contentContainer}>
      <View style={styles(currentTheme).illustrationContainer}>
        <Image
          source={require('../../assets/images/refer-a-friend-2.png')}
          style={styles(currentTheme).illustration}
          resizeMode="contain"
        />
      </View>

      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).title}
        bolder
      >
        {t('Invite & Enjoy Free Delivery')}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).description}
        center
        bold
      >
        {t('You and your friend each get 1 free delivery when they try the app.')}
      </TextDefault>

      <View style={styles(currentTheme).codeContainer}>
        <TouchableOpacity
          style={styles(currentTheme).codeBox}
          onPress={onCopyCode}
          activeOpacity={0.7}
        >
          <Ionicons
            name="copy-outline"
            size={20}
            color={currentTheme.colorTextPrimary}
            style={styles(currentTheme).codeIcon}
          />
          <TextDefault
            textColor={currentTheme.colorTextPrimary}
            style={styles(currentTheme).codeText}
            bold
          >
            {referralCode}
          </TextDefault>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles(currentTheme).shareButton}
        onPress={onShare}
        activeOpacity={0.7}
      >
        <Ionicons
          name="share-social-outline"
          size={20}
          color={currentTheme.white}
          style={styles(currentTheme).shareIcon}
        />
        <TextDefault
          textColor={currentTheme.white}
          style={styles(currentTheme).buttonText}
          bold
        >
          {t('Share invite link')}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

export default InviteState
