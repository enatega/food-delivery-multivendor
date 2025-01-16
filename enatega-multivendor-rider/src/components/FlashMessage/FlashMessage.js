import { showMessage } from 'react-native-flash-message'
import PropTypes from 'prop-types'

export const FlashMessage = props => {
  showMessage({
    message: props.message,
    backgroundColor: 'rgba(52, 52, 52, .9)', // Dark semi-transparent background
    position: 'center', // Center position
    style: {
      borderRadius: 40,
      minHeight: 50, 
    },
  });
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired
}}
