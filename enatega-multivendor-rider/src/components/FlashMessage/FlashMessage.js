import { showMessage } from 'react-native-flash-message'
import PropTypes from 'prop-types'

export const FlashMessage = props => {
  showMessage({
    backgroundColor: 'rgba(52, 52, 52, .9)',
    message: props.message,
    position: 'center',
    style: { borderRadius: 40 }
  })
}
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired
}
