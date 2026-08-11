import { showMessage } from 'react-native-flash-message'
import PropTypes from 'prop-types'

export const FlashMessage = props => {
  showMessage({
    message: props?.message,
    hideOnPress: false,
    onPress: props?.onPress,
    duration: props?.duration ?? 1500
  })
}
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
}
