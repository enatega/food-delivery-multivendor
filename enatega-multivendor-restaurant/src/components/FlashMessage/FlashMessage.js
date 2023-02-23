import { showMessage } from 'react-native-flash-message'
import PropTypes from 'prop-types'

const FlashMessage = props => {
  showMessage({
    backgroundColor: 'rgba(52, 52, 52, .9)',
    message: props.message,
    position: 'center',
    style: { borderRadius: 50 },
    hideOnPress: false,
    onPress: props.onPress
  })
}
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default FlashMessage
