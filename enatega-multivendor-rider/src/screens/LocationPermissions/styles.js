import { StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    screenBackground: {
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    linkButton: {
      ...alignment.Pmedium,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props != null ? props.buttonBackground : '#6FCF97',

      color: props != null ? props.buttonText : 'white',

      borderRadius: 10
    }
  })

export default styles
