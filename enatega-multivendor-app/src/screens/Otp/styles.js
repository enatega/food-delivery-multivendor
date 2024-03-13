import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.MTlarge,
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },

    // logoContainer: {
    //   width: 120,
    //   height: 130,
    //   alignSelf: 'center'
    // },
    marginTop3: {
      ...alignment.MTxSmall
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop10: {
      ...alignment.MTlarge
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    errorInput: {
      backgroundColor: props !== null ? props.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props.errorInputBorder : '#DB4A39'
    },
    btn: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props.main : '#F7E7E5',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 40
    },
    otpInput: {
      height: 70,
      color: '#000',
      ...alignment.MTsmall
    },
    error: {
      ...alignment.MBlarge
    },
    otpBox: {
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: scale(6)
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    },
    disabledBtn: {
      backgroundColor: props !== null ? props.iconBackground : '#333333'
    }
  })
export default styles
