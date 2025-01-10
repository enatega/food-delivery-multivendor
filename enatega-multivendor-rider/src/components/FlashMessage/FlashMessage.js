import { showMessage } from 'react-native-flash-message';
import PropTypes from 'prop-types';

export const FlashMessage = (props) => {
  showMessage({
    message: props.message,
    position: 'center',
    style: {
      borderRadius: 40,
      maxWidth: 300, // Constrain width for wrapping
      padding: 10,
      alignSelf: 'center', // Center the message
    },
    titleStyle: {
      color: 'white',
      textAlign: 'center', // Center text
    },
    backgroundColor: 'rgba(52, 52, 52, .9)',
    floating: true, // Makes the message float above the UI
    animated: true, // Enable animation
    animationDuration: 300, // Animation duration
    autoHide: true, // Automatically hide after a delay
    duration: 4000, // Time before it auto-hides
  });
};

FlashMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
