import React from 'react'
import styles from './styles'
import { AntDesign } from '@expo/vector-icons'



const navigationOptions = props => {

  
  const goBack = () => {
    if (props.vendorMode == "SINGLE") {
      props.navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }]
    })
    } else {
    props?.navigation.goBack()  
    }
    
  }

  return {
    title: null,
    // eslint-disable-next-line react/display-name
    headerRight: () => (
      <AntDesign
        onPress={() => goBack()}
        name="closecircleo"
        size={24}
        color={props?.iconColor}
        style={styles().headerRightIcon}
      />
    ),
    // eslint-disable-next-line react/display-name
    headerLeft: () => (
      <AntDesign
        onPress={() => goBack}
        name="arrowleft"
        size={24}
        color={props?.iconColor}
        style={styles().headerLeftIcon}
      />
    ),
    headerStyle: {
      backgroundColor: props?.backColor
    }
  }
}
export default navigationOptions
