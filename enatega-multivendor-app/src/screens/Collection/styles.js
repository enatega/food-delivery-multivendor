import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props?.headerMenuBackground : '#fff',
      paddingHorizontal: 14,
      paddingTop: 8,
      gap: 12
    },
    headingContainer: {
      paddingTop: 4,
      paddingBottom: 4,
      paddingHorizontal: 5
    },
    headingTitle: {
      marginBottom: 0
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
      gap: 12,
      paddingTop: 4,
      paddingBottom: 50,
      flexGrow: 1
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20
    },
    emptyStateCard: {
      width: '100%',
      borderRadius: 16,
      paddingVertical: 24,
      paddingHorizontal: 18,
      backgroundColor: props?.cardBackground ?? '#fff',
      borderWidth: 1,
      borderColor: props?.newBorderColor ?? '#E5E7EB'
    },
    emptyStateTitle: {
      marginBottom: 8
    },
    emptyStateDescription: {
      lineHeight: 20
    }
  })
export default styles
