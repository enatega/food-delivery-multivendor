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
      paddingBottom: 0,
      backgroundColor: props?.subCategoryTopSection,
      position: 'relative',
      minHeight: scale(42)
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
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: scale(64),
      right: scale(64),
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      paddingVertical: scale(2)
    },
    restaurantName: {
      fontSize: scale(16),
      color: props?.fontMainColor,
      textAlign: 'center',
      lineHeight: scale(18),
      includeFontPadding: false
    },
    deliveryTime: {
      fontSize: scale(13),
      color: props?.fontSecondColor,
      marginTop: scale(1),
      lineHeight: scale(13),
      textAlign: 'center',
      includeFontPadding: false
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
