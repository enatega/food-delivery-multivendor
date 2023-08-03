import React, { useContext, useLayoutEffect, useEffect } from 'react'
import { View, TouchableOpacity, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'

const links = [
  {
    title: 'Product Page',
    url:
      'https://market.nativebase.io/view/enatega-multivendor-food-backend-app'
  },
  {
    title: 'Docs',
    url: 'https://enatega-multi.gitbook.io/enatega-multivendor/'
  },
  {
    title: 'Blog',
    url:
      'https://blog.geekyants.com/enatega-multivendor-foodpanda-clone-v1-0-0-e4b4f21ba1c1'
  },
  { title: 'About Us', url: 'https://ninjascode.com/pages/ourteam.html' }
]
function Help(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_HELP)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      headerTitle: 'Help Center',
      headerRight: null,
      headerTitleContainerStyle: {
        marginBottom: scale(10),
        paddingLeft: scale(20),
        paddingRight: scale(20),
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: '#F5F5F5'
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          backImage={() => (
            <View style={styles(currentTheme).backButton}>
              <MaterialIcons
                name="arrow-back"
                size={30}
                color={currentTheme.black}
              />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation])

  return (
    <SafeAreaView
      edges={['bottom', 'right', 'left']}
      style={styles(currentTheme).flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={currentTheme.headerBackground}
      />
      <View style={styles(currentTheme).flex}>
        <View style={styles().mainContainer}>
          {links.map(({ title, url }, index) => (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('HelpBrowser', { title, url })
              }
              style={styles(currentTheme).itemContainer}
              key={index}>
              <TextDefault textColor={currentTheme.fontMainColor} bolder>
                {title}
              </TextDefault>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Help
