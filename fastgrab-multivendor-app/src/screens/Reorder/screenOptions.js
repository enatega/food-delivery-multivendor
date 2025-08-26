import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'

const navigationOptions = headerText => {
  const { t } = useTranslation()

  return {
    headerTitle: t('titleReorder'),
    headerTitleAlign: 'left',
    headerRight: null,
    headerTitleContainerStyle: {
      marginLeft: scale(0)
    },
    headerBackImage: () =>
      BackButton({ iconColor: headerText, icon: 'leftArrow' })
  }
}

export default navigationOptions
