import React, { useLayoutEffect, useContext, useEffect } from 'react'
import { WebView } from 'react-native-webview'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StatusBar, Platform, View } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'

function Chat() {
  const Analytics = analytics()

  const navigation = useNavigation()
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      headerTitle: t('titleChat'),
      headerTitleStyle: {
        color: '#000',
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.white,
        elevation: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={25} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent')
    }
    StatusBar.setBarStyle('dark-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CHAT)
    }
    Track()
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
