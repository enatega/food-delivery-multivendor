import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import styles from './styles'
import i18n from '../../../i18n'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import { useNavigation } from '@react-navigation/native'

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
function Help() {
  const navigation = useNavigation()
  const inset = useSafeArea()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      headerTitle: i18n.t('titleHelp')
    })
  }, [navigation])

  return (
    <>
      <View style={styles.flex}>
        {links.map(({ title, url }, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('HelpBrowser', { title, url })}
            style={styles.itemContainer}
            key={index}>
            <TextDefault textColor={colors.fontMainColor} H4>
              {title}
            </TextDefault>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: colors.themeBackground
        }}
      />
    </>
  )
}

export default Help
