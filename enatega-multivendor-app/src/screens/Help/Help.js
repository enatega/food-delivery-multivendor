import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, StatusBar, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import { alignment } from '../../utils/alignment'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Analytics from '../../utils/analytics'
import { useFocusEffect } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'

const Help = props => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const [links, setLinks] = useState([
    {
      title: t('titleProductPage'),
      url: 'https://enatega.com/enatega-multi-vendor/'
    },
    {
      title: t('titleDocs'),
      url: 'https://enatega.com/multi-vendor-doc/'
    },
    {
      title: t('myAccount'),
      url: 'https://ninjascode.com/'
    },
    {
      title: t('titleBlog'),
      url: 'https://enatega.com/blog/'
    },
    {
      title: t('titleAboutUs'),
      url: 'https://ninjascode.com/about-us/'
    }
  ])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent')
    }
    StatusBar.setBarStyle('dark-content')
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_HELP)
    }
    Track()
  }, [])

  useEffect(() => {
    // Update translations when the language changes
    setLinks([
      {
        title: t('titleProductPage'),
        url:
          'https://enatega.com/enatega-multivendor-open-source-food-delivery-solution/'
      },
      {
        title: t('titleDocs'),
        url: 'https://enatega.com/multivendor-documentation/'
      },
      {
        title: t('titleBlog'),
        url:
          'https://enatega.com/blogs-enatega-open-source-food-delivery-solutions/'
      },
      {
        title: t('titleAboutUs'),
        url: 'https://ninjascode.com/'
      }
    ])
  }, [])
  567
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: t('titleHelp'),
      headerTitleAlign: 'center',
      headerRight: null,
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
  }, [props.navigation])

  return (
    <SafeAreaView
      edges={['bottom', 'right', 'left']}
      style={styles(currentTheme).flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={currentTheme.themeBackground}
      />
      <View style={styles(currentTheme).flex}>
        <View style={styles(currentTheme).topContainer}>
          <TextDefault bolder H5 style={{ ...alignment.PLsmall }}>
            How can we help?
          </TextDefault>
        </View>
        <View style={styles(currentTheme).mainContainer}>
          {links.map(({ title, url }, index) => (
            <TouchableOpacity
              style={styles(currentTheme).itemContainer}
              onPress={() =>
                props.navigation.navigate('HelpBrowser', { title, url })
              }
              key={index}>
              <View>
                <TextDefault textColor={currentTheme.fontMainColor} bolder>
                  {title}{' '}
                </TextDefault>
              </View>
              <AntDesign
                name="right"
                size={20}
                color={currentTheme.darkBgFont}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Help
