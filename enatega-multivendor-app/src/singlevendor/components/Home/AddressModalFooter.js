import { View, Text, Pressable } from 'react-native'
import React, { useContext, useMemo } from 'react'
import styles from './Styles'
import UserContext from '../../../context/User'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const AddressModalFooter = ({ onClose }) => {
  const navigation = useNavigation()

  const { isLoggedIn } = useContext(UserContext)

  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])
  return (
    <Pressable
      activeOpacity={0.5}
      style={styles.addButton}
      onPress={() => {
        if (isLoggedIn) {
          navigation.navigate('AddAddress', {
            // prevScreen: 'Home',
            // ...location
          })
        } else {
          //   const modal = modalRef.current
          //   modal?.close()
          onClose()
          navigation.navigate({
            name: 'CreateAccount'
          })
        }
      }}
    >
      <View style={styles.addressSubContainer}>
        <AntDesign name='plus' size={scale(20)} color={currentTheme.darkBgFont} />
        <View style={styles.mL5p} textColor={currentTheme.black} />
        <TextDefault bold H5 textColor={currentTheme.darkBgFont}>
          {t('addAddress')}
        </TextDefault>
      </View>
    </Pressable>
  )
}

export default AddressModalFooter
