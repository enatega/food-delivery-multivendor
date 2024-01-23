import { useTranslation } from 'react-i18next'
import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import { View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import styles from './styles'

const navigationOptions = headerText => {
  const { t } = useTranslation() // Initializing the useTranslation hook

  return {
    title: t('titleFavourite'), // Using translation function to get the title
    headerTitleAlign: 'center',
    headerRight: null,
    headerTitleContainerStyle: {
      // marginBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: 'black',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: scale(10),
      marginLeft: 0
    },
    headerStyle: {
      backgroundColor: '#F5F5F5',
      border: 1,
      borderColor: 'white',
      borderRadius: scale(10)
    },
    headerLeft: () => (
      <HeaderBackButton
        truncatedLabel=""
        backImage={() => (
          <View style={styles().backImageContainer}>
            <MaterialIcons name="arrow-back" size={30} color="black" />
          </View>
        )}
        onPress={() => {
          navigationService.goBack()
        }}
      />
    )
  }
}

export default navigationOptions
