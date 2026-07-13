import React from 'react'
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { GET_MY_REFERRAL_CODE } from '../../apollo/queries'
import styles from '../../screens/ReferAFriend/styles'

const InviteState = ({ currentTheme, referralCode: propReferralCode, onCopyCode, onShare }) => {
  const { t } = useTranslation()
  
  const { data, loading, error, refetch } = useQuery(GET_MY_REFERRAL_CODE)

  
  const referralCode = data?.getMyReferralCode  || ''
  
  const handleRetry = () => {
    refetch()
  }
  
  const handleCopyCodePress = () => {
    if (referralCode && !loading && !error) {
      onCopyCode(referralCode)
    }
  }
  
  const handleSharePress = () => {
    if (referralCode && !loading && !error) {
      onShare(referralCode)
    }
  }

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
          style={[
            styles(currentTheme).codeBox,
            error && { backgroundColor: '#ffebee' }
          ]}
          onPress={error ? handleRetry : handleCopyCodePress}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator 
              size="small" 
              color={currentTheme.colorTextPrimary} 
            />
          ) : error ? (
            <>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#d32f2f"
                style={styles(currentTheme).codeIcon}
              />
              <TextDefault
                textColor="#d32f2f"
                style={styles(currentTheme).codeText}
                bold
              >
                {t('Try again')}
              </TextDefault>
            </>
          ) : (
            <>
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
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles(currentTheme).shareButton}
        onPress={handleSharePress}
        activeOpacity={0.7}
        disabled={loading || error || !referralCode}
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
