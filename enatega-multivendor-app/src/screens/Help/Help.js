import React, { useContext, useEffect } from 'react'
import { View, StatusBar, Platform, FlatList, Linking, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Analytics from '../../utils/analytics'
import { useFocusEffect } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'
import Accordion from '../../components/Accordion/Accordion'
import { FontAwesome } from '@expo/vector-icons'

const FAQs = [
  {
    id: 1,
    heading: 'faq1',
    description: 'faq1Description'
  },
  {
    id: 2,
    heading: 'faq2',
    description: 'faq2Description'
  },
  {
    id: 3,
    heading: 'faq3',
    description: 'faq3Description'
  },
  {
    id: 4,
    heading: 'faq4',
    description: 'faq4Description'
  },
  {
    id: 5,
    heading: 'faq5',
    description: 'faq5Description'
  },
  {
    id: 6,
    heading: 'faq6',
    description: 'faq6Description'
  },
  {
    id: 7,
    heading: 'faq7',
    description: 'faq7Description'
  }
]

const Help = props => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const openWhatsAppChat = () => {
    Linking.openURL('whatsapp://send?phone=15408006867')
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useEffect(() => {
    async function Track() {
      try {
        await Analytics.track('NAVIGATE_TO_FAQS')
      } catch(err){
        // console.log('ERORORORO =>', err)
      }
    }
    Track()
  }, [])

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: t('titleFAQ'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
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
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={25} color={currentTheme.newIconColor} />
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
      style={styles(currentTheme).flex}
    >
      <StatusBar
        barStyle='light-content'
        backgroundColor={currentTheme.themeBackground}
      />
      <View
        style={[styles(currentTheme).flex, styles(currentTheme).mainContainer]}
      >
        <FlatList
          data={FAQs}
          keyExtractor={(item) => 'Faq-' + item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <Accordion heading={t(item.heading)}>
              <TextDefault textColor={currentTheme.newFontcolor}>
                {t(item.description)}
              </TextDefault>
            </Accordion>
          )}
        />

        <View>
          <View style={styles(currentTheme).containerButton}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles(currentTheme).addButton}
              onPress={openWhatsAppChat}
            >
              <View style={styles(currentTheme).contentContainer}>
                <FontAwesome
                  name='whatsapp'
                  size={24}
                  color={currentTheme.black}
                />
                <TextDefault bold H5 style={styles(currentTheme).whatsAppText}>
                  {t('whatsAppText')}
                </TextDefault>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Help
