import React, { useContext, useLayoutEffect } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { useTranslation } from 'react-i18next'
import { AntDesign } from '@expo/vector-icons'

import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
import { AccountListItem } from '../../components/Common'

import styles from './styles'

const AccountDetails = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('Account details'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingLeft: scale(25),
        paddingRight: scale(25)
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: { height: 0 },
        elevation: 0,
        borderBottomWidth: 0,
        height: scale(100)
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLsmall, alignItems: 'center' }}>
              <View style={{
                width: scale(36),
                height: scale(36),
                borderRadius: scale(18),
                backgroundColor: currentTheme.colorBgTertiary || '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <AntDesign 
                  name='arrowleft' 
                  size={20} 
                  color={currentTheme.fontMainColor || '#000'} 
                />
              </View>
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    })
  }, [navigation, currentTheme, t])

  const accountItems = [
    {
      id: 1,
      label: t('Name'),
      value: profile?.name || '',
      verified: false,
      onPress: () => {
        // Navigate to edit name screen
        navigation.navigate('EditNameSingleVendor', {
          name: profile?.name,
          phone: profile?.phone
        })
      }
    },
    {
      id: 2,
      label: t('Phone number'),
      value: profile?.phone || '',
      verified: profile?.phoneIsVerified || false,
      onPress: () => {
        // Navigate to edit phone screen
        navigation.navigate('EditPhoneSingleVendor', {
          phone: profile?.phone
        })
      }
    },
    {
      id: 3,
      label: t('Email'),
      value: profile?.email || '',
      verified: profile?.emailIsVerified || false,
      onPress: null // Email is not editable
    }
  ]

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      {/* Content */}
      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles(currentTheme).listContainer}>
          {accountItems.map((item) => (
            <AccountListItem
              key={item.id}
              currentTheme={currentTheme}
              label={item.label}
              value={item.value}
              verified={item.verified}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountDetails
