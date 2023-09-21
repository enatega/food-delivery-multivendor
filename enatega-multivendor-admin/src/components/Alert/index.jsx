import React from 'react'
import Alert from '@material-ui/lab/Alert'

const styles = {
  alert: {
    left: '0',
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: '1500'
  }
}

const AlertMessage = props => {
  return (
    <Alert style={styles.alert} severity={props.severity}>
      {props.message}
    </Alert>
  )
}

export default AlertMessage
