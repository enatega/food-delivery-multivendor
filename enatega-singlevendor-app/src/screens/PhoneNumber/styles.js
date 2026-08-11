import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      ...alignment.MTlarge,
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },

    marginTop10: {
      ...alignment.MTlarge
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    alignItemCenter: {
      alignItems: 'center'
    },
    twoContainers: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    width48: {
      width: '48%'
    },

    form: {
      width: '100%',
      ...alignment.MTlarge
    },
    textField: {
      borderColor: props !== null ? props?.borderColor : '#efefef',
      borderWidth: scale(1),
      borderRadius: scale(10),
      backgroundColor: props !== null ? props?.themeBackground : 'white',
      justifyContent: 'center',
      color: props !== null ? props?.newFontcolor : 'red',
      ...alignment.MBxSmall,
      ...alignment.MTxSmall
    },
    btn: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.main : '#F7E7E5',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 40
    },
    number: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    countryCode: {
      flexDirection: 'row',
      width: '27%',
      marginRight: '3%'
    },
    phoneNumber: {
      width: '70%'
    },
    phoneField:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneNo:{
      color: props !== null ? props?.newFontcolor : '#f5f5f5f',
      width: '100%',
      padding: scale(12)
    },
    error: {
      marginTop: 3
    },
    errorInput: {
      backgroundColor: props !== null ? props?.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props?.errorInputBorder : '#DB4A39'
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })

export default styles
