import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent:'space-between',
      alignItems: 'center',
    gap:scale(4),
      marginBottom:scale(15)
    },
    suggestItemImg:{
      aspectRatio: 6/8,
      height:scale(50) 
    },
    suggestItemImgContainer:{
      backgroundColor: '#F3F4F6',
      borderWidth:1,
      borderColor:'#E5E7EB',
      borderRadius:8,
      padding:scale(4),
     
    },
    divider:{
      width:scale(1),
      height:scale(15),
      backgroundColor: props !== null ? props?.verticalLine : '#D1D5DB'
    },
    actionContainer: {
      width: '30%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.newBorderColor : '#F3F4F6',
      borderRadius:40,
      borderWidth:1,
      borderColor:props !== null ? props?.iconBackground: '#fcfcfc',
    },
    actionContainerBtns: {
      width: scale(30),
      height:scale(30),
      borderRadius: scale(20),
      alignItems: 'center',
     justifyContent:'center'
    },
    minusBtn:{
      backgroundColor: '#fff',
    },
    plusBtn:{
      backgroundColor: '#111827',
    },
    actionContainerView: {    
      justifyContent: 'center',
      alignItems: 'center',
    },
    additionalItem:{
      marginTop:scale(4),
      marginBottom:scale(2),
    },
    itemsDropdown:{
      borderLeftWidth:2.5,
      borderColor:'#D1D5DB',
      paddingLeft:scale(8),
      marginVertical:scale(3)
    }
  })
export default styles
