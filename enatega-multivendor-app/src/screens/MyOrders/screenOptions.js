import i18n from '../../../i18n'
import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import { View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'

const navigationOptions = headerText => ({
  headerTitle: i18n.t('titleOrders'),
  headerTitleAlign: 'left',
  headerRight: null,
  headerTitleContainerStyle: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'black',
    border: 1,
    borderColor: 'white',
    borderRadius: scale(10),
    marginLeft: 0
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
