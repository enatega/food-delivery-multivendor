import React, { useContext, useEffect, useState } from 'react'
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
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { WhatsAppNotInstalledModal } from '../../components/Help/WhatsAppNotInstalledModal'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

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

const Help = (props) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [isModalVisible, setisModalVisible] = useState(false)

  const handleNavigation = () => {
    setisModalVisible(false)
    Linking.openURL('https://play.google.com/store/apps/details?id=com.whatsapp')
  }

  const openWhatsAppChat = async () => {
    const phoneNumber = '+14232600408'

    if (Platform.OS === 'android') {
      const androidUrl = `whatsapp://send?phone=${phoneNumber}`

      try {
        const supported = Linking.canOpenURL(androidUrl)
        if (supported) {
          await Linking.openURL(androidUrl)
        }
      } catch (error) {
        setisModalVisible(true)
        console.error('Error opening URL', error)
      }
    } else if (Platform.OS === 'ios') {
      const iosUrl = `https://wa.me/${phoneNumber.replace('+', '')}`

      try {
        const supported = await Linking.canOpenURL(iosUrl)

        if (supported) {
          await Linking.openURL(iosUrl)
        } else {
          console.log('WhatsApp is not installed on the device')
          setisModalVisible(true)
        }
      } catch (error) {
        console.error('Error opening URL', error)
      }
    }
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useEffect(() => {
    async function Track() {
      try {
        await Analytics.track('NAVIGATE_TO_FAQS')
      } catch (err) {
        // console.log('ERORORORO =>', err)
      }
    }
    Track()
  }, [])

  useEffect(() => {
    props?.navigation.setOptions({
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
          truncatedLabel=''
          backImage={() => (
            <View>
              <MaterialIcons name='arrow-back' size={25} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props?.navigation])

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <SafeAreaView edges={['bottom', 'right', 'left']} style={styles(currentTheme).flex}>
      <StatusBar barStyle='light-content' backgroundColor={currentTheme.themeBackground} />
      <View style={[styles(currentTheme).flex, styles(currentTheme).mainContainer]}>
        <FlatList
          data={FAQs}
          keyExtractor={(item) => 'Faq-' + item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <Accordion heading={t(item.heading)}>
              <TextDefault textColor={currentTheme.newFontcolor} isRTL>
                {t(item.description)}
              </TextDefault>
            </Accordion>
          )}
        />

        <View>
          <View style={styles(currentTheme).containerButton}>
            <TouchableOpacity activeOpacity={0.5} style={styles(currentTheme).addButton} onPress={openWhatsAppChat}>
              <View style={styles(currentTheme).contentContainer}>
                <FontAwesome name='whatsapp' size={24} color={currentTheme.black} />
                <TextDefault textColor={currentTheme.black} bold H5 style={styles(currentTheme).whatsAppText}>
                  {t('whatsAppText')}
                </TextDefault>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <WhatsAppNotInstalledModal theme={currentTheme} modalVisible={isModalVisible} setModalVisible={() => setisModalVisible(!isModalVisible)} handleNavigation={handleNavigation} />
      </View>
    </SafeAreaView>
  )
}

export default Help
