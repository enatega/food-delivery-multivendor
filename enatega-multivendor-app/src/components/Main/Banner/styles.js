import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: scale(30),
      marginBottom: scale(16)
    },
    banner: {
      flex: 1,
      height: scale(190),
      margin: 0,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: props?.themeBackground ?? '#fff',
      paddingHorizontal: scale(16)
    },
    image: {
      width: '100%',
      alignSelf: 'center',
      resizeMode: 'cover',
      flex: 1,
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 14,
      objectFit: 'cover'
    },
    container: {
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: props?.isRTL ? 'flex-end' : 'flex-start',
      justifyContent: 'flex-end',
      paddingVertical: scale(20),
      paddingHorizontal: scale(18),
      borderRadius: 14
    },
    pagination: {
      position: 'relative',
      gap: -8
    },
    paginationItem: {
      height: 6,
      width: 6
    },
    imgs1:
    {
      overflow: 'hidden',
      resizeMode: 'cover',
      alignSelf: 'center',
      width: '100%',
      height: '100%',
      borderRadius: 14
    },
    csd:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      paddingHorizontal: 0,
      backgroundColor: 'transparent'
    }
  })
export default styles
