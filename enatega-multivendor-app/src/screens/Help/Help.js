import React, { useContext, useEffect } from 'react'
import {
  View,
  StatusBar,
  Platform,
  FlatList
} from 'react-native'
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

const FAQs = [
  {
    "id": 1,
    "heading": "How do I place an order?",
    "description": "To place an order, simply download our app, sign up or log in, browse through the list of restaurants available in your area, select your desired items from the menu, and proceed to checkout. You can also track your order in real-time."
  },
  {
    "id": 2,
    "heading": "What payment methods are accepted?",
    "description": "We accept a variety of payment methods including credit/debit cards, digital wallets, and cash on delivery. You can choose your preferred payment option during the checkout process."
  },
  {
    "id": 3,
    "heading": "Can I schedule orders in advance?",
    "description": "Yes, you can schedule orders for later delivery. Simply select the desired delivery time during checkout, and our app will ensure your order reaches you at the specified time."
  },
  {
    "id": 4,
    "heading": "How do I modify or cancel my order?",
    "description": "If you need to modify or cancel your order, please contact our customer support team as soon as possible. Depending on the stage of preparation, modifications or cancellations may be accommodated."
  },
  {
    "id": 5,
    "heading": "Is there a minimum order requirement?",
    "description": "Minimum order requirements may vary depending on the restaurant you choose. The minimum order amount, if applicable, will be displayed during the checkout process."
  },
  {
    "id": 6,
    "heading": "What if I have dietary restrictions or allergies?",
    "description": "Our app allows you to filter restaurants based on dietary preferences and allergens. Additionally, you can leave special instructions for the restaurant regarding any dietary restrictions or allergies, and they will do their best to accommodate your needs."
  }
]


const Help = props => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent')
    }
    StatusBar.setBarStyle('dark-content')
  })

  useEffect(() => {
    async function Track() {
      try{
        await Analytics.track('NAVIGATE_TO_FAQS')
      } catch(err){
        console.log('ERORORORO =>', err)
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
        <View style={styles(currentTheme).mainContainer}>
          <FlatList
            data={FAQs}
            keyExtractor={item => 'Faq-' + item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <Accordion heading={item.heading}>
                <TextDefault>{item.description}</TextDefault>
              </Accordion>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Help
