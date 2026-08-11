import { BackButton } from '../../components/Header/HeaderIcons/HeaderIcons'

const navigationOptions = headerText => ({
  headerRight: null,
  headerBackImage: () =>
    BackButton({ iconColor: headerText, icon: 'leftArrow' })
})
export default navigationOptions
