import { verticalScale, scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native'
const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    banner: {
      flex: 1,
      height: scale(200),
      width: width - 15 * 2.5, // 15 is the medium margin
      backgroundColor: props !== null ? props?.shadow : '#707070',
      shadowColor: props !== null ? props?.shadow : '#707070',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
      borderRadius: 8,
      ...alignment.MLmedium,
      ...alignment.MRmedium,
      ...alignment.MTmedium
    },
    image: {
      width: '100%',
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
      gap: 8,
      ...alignment.Psmall
    },
    pagination: {
      position: 'relative',
      gap: -8
    },
    paginationItem: {
      height: 10,
      width: 10
    }
  })
export default styles
