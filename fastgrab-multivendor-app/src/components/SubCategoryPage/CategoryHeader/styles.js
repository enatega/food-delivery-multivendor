import { StyleSheet, Platform, StatusBar } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      // backgroundColor: props?.themeBackground,
      backgroundColor: props?.subCategoryTopSection
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(15),
      paddingTop: Platform.OS === 'android' ? 0 : 0,
      paddingBottom: scale(10),
      backgroundColor: props?.subCategoryTopSection,
      // backgroundColor: props?.themeBackground,
      position: 'relative' // Added for absolute positioning of center content
    },
    iconButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: props?.gray100,
      justifyContent: 'center',
      alignItems: 'center'
    },
    restaurantInfoContainer: {
      flex: 2, // Allows the center section to take space and align properly
      alignItems: 'center',
      justifyContent: 'center'
    },
    restaurantName: {
      fontSize: scale(16),
      color: props?.fontMainColor,
      textAlign: 'center'
    },
    deliveryTime: {
      fontSize: scale(13),
      color: props?.fontSecondColor,
      marginTop: scale(2),
      textAlign: 'center'
    },
    leftSection: {
      flex: 1,
      alignItems: 'flex-start'
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end'
    }
  })

export default styles
