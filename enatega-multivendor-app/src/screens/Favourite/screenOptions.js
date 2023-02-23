import i18n from '../../../i18n'
import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { scale } from '../../utils/scaling'

const navigationOptions = headerText => ({
  headerTitle: i18n.t('titleFavourite'),
  headerTitleAlign: 'left',
  headerRight: null,
  headerTitleContainerStyle: {
    marginLeft: scale(0)
  },
  headerBackImage: () =>
    BackButton({ iconColor: headerText, icon: 'leftArrow' })
})
export default navigationOptions
