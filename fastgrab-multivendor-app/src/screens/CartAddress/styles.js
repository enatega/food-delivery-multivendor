import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { verticalScale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      
    },
    width100: {
      width: '100%'
    },
    width10: {
      width: '10%'
    },
    titleAddress: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    },
    homeIcon: {
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    homeIconImg: {
      width: scale(15),
      height: scale(15)
    },
    cartAddress:{
      ...alignment.PBmedium,
      backgroundColor: props !== null ? props.themeBackground : 'transparent',

    },
    addressContainer: {
      width: '93%',
      alignSelf: 'center',
      borderRadius: scale(10),
      backgroundColor: props !== null ? props.gray100 : 'transparent',
      ...alignment.PTsmall,
      ...alignment.PBsmall,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      borderWidth: 1,
      alignSelf: 'center',
      borderColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    addressDetail: {
      width: '80%',
      alignSelf: 'flex-end'
    },
    line: {
      width: '80%',
      alignSelf: 'flex-end',
      borderBottomColor: 'lightgrey',
      borderBottomWidth: 1,
      ...alignment.MTmedium,
      ...alignment.MBmedium
    },
    
    containerSpace: {
      backgroundColor: props !== null ? props.cardBackground : 'transparent',
      width: '92%',
      // margin: scale(10),
      padding: scale(5),
      borderRadius: scale(10),
      borderWidth: 1,
      alignSelf: 'center',
      borderColor: props !== null ? props.customBorder : '#E5E7EB',
    },

    containerButton: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      width: '90%',
      height: scale(55),
      bottom: verticalScale(0),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      ...alignment.PBmedium
    },
    addButton: {
      backgroundColor: props !== null ? props.newheaderColor : 'transparent',
      width: '100%',
      height: scale(40),
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },

  })
export default styles
