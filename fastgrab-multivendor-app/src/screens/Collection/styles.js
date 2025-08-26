import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props?.headerMenuBackground : '#fff',
      padding: 10,
      gap: 16
    },
    collectionCard: {
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      height: 150,
      width: '100%',
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
      height: 110,
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    columnWrapperStyle: {
      flex: 1,
      justifyContent: 'space-between',
      gap: 8
    },
    contentContainerStyle: {
      gap: 16,
      paddingBottom: 50
    }
  })
export default styles
