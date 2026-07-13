import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    collectionCard: {
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      height: 130,
      width: 100,
      borderRadius: 8,
      shadowColor: props !== null ? props?.iconColor : 'gray',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    collectionImage: {
      height: 80,
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
  })
export default styles
