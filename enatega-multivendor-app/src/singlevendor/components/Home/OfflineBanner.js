import React from 'react'
import { View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'

const OfflineBanner = ({ currentTheme, t }) => {
  return (
    <View
      style={{
        marginHorizontal: scale(12),
        marginBottom: 12,
        paddingVertical: 16,
        paddingHorizontal: 14,
        borderRadius: 16,
        backgroundColor: currentTheme?.colorBgSecondary || currentTheme?.cardBackground || '#fff',
        borderWidth: 1,
        borderColor: currentTheme?.newBorderColor2 || currentTheme?.newBorderColor || '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: currentTheme?.shadowColor || '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: currentTheme?.colorBgTertiary || '#f4f4f5',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12
        }}
      >
        <AntDesign
          name="disconnect"
          size={20}
          color={currentTheme?.iconColorDark || currentTheme?.iconColor}
        />
      </View>
      <View style={{ flex: 1 }}>
        <TextDefault textColor={currentTheme?.fontMainColor} H5 bolder>
          {t('offlineTitle') || 'You are offline'}
        </TextDefault>
        <TextDefault textColor={currentTheme?.fontSecondColor} H6>
          {t('checkInternet') || 'Please check your internet connection.'}
        </TextDefault>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: currentTheme?.singleVendorBrandSubtle || '#F3FFEE'
        }}
      >
        <TextDefault textColor={currentTheme?.singleVendorBrandForeground} H6 bolder>
          {t('offlineBadge') || 'Offline'}
        </TextDefault>
      </View>
    </View>
  )
}

export default OfflineBanner
