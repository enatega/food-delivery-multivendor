import React, { useContext, useLayoutEffect, useEffect } from 'react'
import { View, TouchableOpacity, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Analytics from '../../utils/analytics'
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
  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_HELP)
  }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      headerTitle: 'Help Center'
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
        {links.map(({ title, url }, index) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('HelpBrowser', { title, url })
            }
            style={styles(currentTheme).itemContainer}
            key={index}>
            <TextDefault textColor={currentTheme.fontMainColor} bold>
              {title}
            </TextDefault>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

export default Help
