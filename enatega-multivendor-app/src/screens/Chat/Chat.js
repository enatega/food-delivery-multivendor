import React, { useLayoutEffect, useContext, useEffect } from 'react'
import { WebView } from 'react-native-webview'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StatusBar, Platform } from 'react-native'
import i18n from '../../../i18n'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import Analytics from '../../utils/analytics'

function Chat() {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      headerTitle: i18n.t('titleChat')
    })
  }, [navigation])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_CHAT)
  }, [])
  return (
    <WebView
      startInLoadingState={true}
      source={{
        uri: 'https://sharangoharkhan.github.io/multivendor-chat/'
      }}
      onNavigationStateChange={data => {
        if (data.url.indexOf('enatega') > 0) {
          navigation.navigate({
            name: 'Main',
            merge: true
          })
        }
      }}
    />
  )
}

export default Chat
