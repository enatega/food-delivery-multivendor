import i18n from '../../../i18n'
import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import { View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { StatusBar } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

const navigationOptions = headerText => ({
  headerTitle: i18n.t('titleOrders'),
  headerTitleAlign: 'center',
  headerRight: null,
  headerTitleContainerStyle: {
    marginTop: scale(10),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    borderRadius: scale(10),
    height: scale(28),
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white'
  },
  headerStyle: {
    backgroundColor: '#F5F5F5'
  },

  headerLeft: () => (
    <HeaderBackButton
      backImage={() => (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 50,
            marginLeft: 10,
            width: 55,
            alignItems: 'center'
          }}>
          <MaterialIcons name="arrow-back" size={30} color="black" />
        </View>
      )}
      onPress={() => {
        navigationService.goBack()
      }}
    />
  )
})
export default navigationOptions
