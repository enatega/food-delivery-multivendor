import { verticalScale, scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native'
import { subtleCardShadow } from '../../../utils/cardShadows'
const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    banner: {
      flex: 1,
      height: scale(200),
      ...subtleCardShadow,
      margin: 0,
      borderRadius: 8
    },
    image: {
      width: '90%',
      alignSelf:"center",
      resizeMode: 'cover',
      flex: 1,
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 8,
      objectFit: 'cover'
    },
    container: {
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: props?.isRTL ? 'flex-end' : 'flex-start',
      justifyContent: 'flex-end',
    },
    pagination: {
      position: 'relative',
      gap: -8
    },
    paginationItem: {
      height: 10,
      width: 10
    },
    imgs1:
    {
      overflow:"hidden",
      resizeMode: "cover",
      alignSelf: 'center',
      width: "100%",
      height:"100%",
      borderRadius: 8,
    
    },
    csd:
    {

    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    width: '100%',
      height: "100%",
    paddingHorizontal:'5%',
    }
  })
export default styles
