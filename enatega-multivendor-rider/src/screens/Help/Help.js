import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import { useNavigation } from '@react-navigation/native'
import {useTranslation} from 'react-i18next'


const links = [
  {
    title: ('productPage'),
    url:
      'https://market.nativebase.io/view/enatega-multivendor-food-backend-app'
  },
  {
    title: ('docs'),
    url: 'https://enatega-multi.gitbook.io/enatega-multivendor/'
  },
  {
    title: ('blog'),
    url:
      'https://blog.geekyants.com/enatega-multivendor-foodpanda-clone-v1-0-0-e4b4f21ba1c1'
  },
  { title: ('aboutUs'), url: 'https://ninjascode.com/pages/ourteam.html' }
]
function Help() {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const inset = useSafeArea()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      headerTitle: t('titleHelp')
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
              {t('title')}
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
